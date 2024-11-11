package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"math/rand"
	"net/http"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins
	},
}

var broadcast = make(chan Message)

func handleConnections(w http.ResponseWriter, r *http.Request, c *Clients) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading to websocket: %v", err)
		return
	}
	defer ws.Close()

	clientId := c.SafeAdd(ws) //aggiunge client a c
	initialMsg := Message{
		Action:   "setClientId",
		ClientID: clientId,
	}
	err = ws.WriteJSON(initialMsg) //Manda il Clientid all'utente
	if err != nil {
		log.Printf("Error sending clientId to client: %v", err)
		return
	}

	for {
		var msg Message
		err := ws.ReadJSON(&msg) //blocking operation
		log.Printf("Received message: Action: %s, Player: %s, Value: %d, Suit: %s", msg.Action, msg.Player, msg.Value)
		if err != nil {
			log.Printf("Error reading JSON: %v", err)
			//	delete(c.v, id)
			break
		}

		broadcast <- msg
	}
}

func handleMessages(games GameCollection, c *Clients, gc *int) {

	for {
		msg := <-broadcast
		switch msg.Action {
		case "startGame":
			switch msg.Value {
			case 0:
				fmt.Println("stai giocando vs cpu")

				game := NewGame([]string{"simo", "bot"}, []bool{false, true}, gc)
				games[game.Id] = game
				//Aggiunge ad un clientId il GameId
				games.PrintGames()
				//
				clientInfo := c.clients[msg.ClientID]
				clientInfo.GameId = game.Id
				c.clients[msg.ClientID] = clientInfo
				c.PrintClients()

			default:
				log.Println("Modalità sconoscoiuta:", msg.Value)
			}

		case "pick_card":
			//	gameId, exists := c.clients[msg.ClientID]
			handlePickCard(msg, games, c)
			games.PrintGames()

		default:
			log.Println("Unknown action:", msg.Action)
		}

		/* Broadcast the message to all connected clients (Per pvp)
		for client := range clients {
			err := client.WriteJSON(msg) //takes the msg struct, converts it to JSON, and it over the WebSocket connection to the specified client.
			if err != nil {
				log.Printf("Error writing JSON: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
		*/
	}
}

func handlePickCard(msg Message, games GameCollection, c *Clients) {
	clientInfo := c.clients[msg.ClientID]
	game, gameExists := games[clientInfo.GameId]
	if !gameExists {
		log.Printf("Game not found for client %s", msg.ClientID)
		return
	}

	//Controlla turno
	iTurn := game.Turn % len(game.Players)
	if game.Players[iTurn].Name != msg.Player {
		log.Printf("Not %s's turn", msg.Player)
		return
	}
	pickCard(game, msg.Value)

	if len(game.CurrentTrick) == len(game.Players) {
		winnerIndex := game.DetermineTrickWinner()
		game.ScoreTrick(winnerIndex)
		log.Printf("Player %s wins the trick", game.Players[winnerIndex].Name)
		game.Turn = winnerIndex
		// Check if deck has cards to draw
		if len(game.Deck) > 0 {
			game.Draw()
		} else {
			// End game logic can go here if the deck is exhausted
		}
		broadcastGameState(game, c)

		if game.Players[game.Turn].Name == "bot" {
			playBotTurn(game, c)
		}
	} else {
		// Advance to the next player's turn
		game.Turn = (game.Turn + 1) % len(game.Players)
		if game.Players[game.Turn].Name == "bot" {
			playBotTurn(game, c)

		}
	}
}
func pickCard(game *Game, pickNum int) {
	pickedCard := game.Players[game.Turn].Hand[pickNum]
	game.CurrentTrick = append(game.CurrentTrick, pickedCard)
	game.Players[game.Turn].Hand = removeCard(game.Players[game.Turn].Hand, pickedCard)
	log.Printf("Player %s played %v of %s", game.Players[game.Turn].Name, pickedCard.Value, pickedCard.Suit)
}
func removeCard(hand []Card, card Card) []Card {
	for i, c := range hand {
		if c.Value == card.Value && c.Suit == card.Suit {
			return append(hand[:i], hand[i+1:]...)
		}
	}
	return hand
}

func playBotTurn(game *Game, c *Clients) {
	iTurn := game.Turn
	bot := &game.Players[iTurn]

	pickNum := rand.Intn(len(bot.Hand))
	pickCard(game, pickNum) // Bot plays its chosen card

	if len(game.CurrentTrick) == len(game.Players) {
		// Determine the winner of the trick
		winnerIndex := game.DetermineTrickWinner()
		game.ScoreTrick(winnerIndex)
		log.Printf("Player %s wins the trick", game.Players[winnerIndex].Name)

		// Set the next turn to the winner
		game.Turn = winnerIndex

		// Draw cards for players if available
		if len(game.Deck) > 0 {
			game.Draw()
		} else {
			// End game logic can go here if the deck is exhausted
		}

		// Notify clients of the updated game state
		broadcastGameState(game, c)

		// If the bot won, it should immediately start the next trick
		if game.Players[game.Turn].Name == "bot" {
			playBotTurn(game, c)
		}
	} else {
		// If the trick is not complete, proceed to the next player's turn
		game.Turn = (game.Turn + 1) % len(game.Players)

		// If the next player is the bot, have the bot play its turn
		if game.Players[game.Turn].Name == "bot" {
			playBotTurn(game, c)
		}
	}
}
func broadcastGameState(game *Game, c *Clients) {
	for _, client := range c.clients {
		if client.GameId == game.Id {
			err := client.Conn.WriteJSON(game) // Simplified for illustration
			if err != nil {
				log.Printf("Error broadcasting game state to client %v: %v", client, err)
			}
		}
	}
}
