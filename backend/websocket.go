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

func pickCard(g *Game, pickNum int) {
	pickedCard := g.Players[g.Turn].Hand[pickNum]
	g.CurrentTrick[g.Turn] = pickedCard
	g.Players[g.Turn].Hand = removeCard(g.Players[g.Turn].Hand, pickedCard)
	g.CardsPlayed++
	log.Printf("IL GIOCATORE %s HA SCELTO %v DI %s", g.Players[g.Turn].Name, pickedCard.Value, pickedCard.Suit)
	fmt.Printf("TRICK: %v\n ", g.CurrentTrick)
}
func removeCard(hand []Card, card Card) []Card {
	for i, c := range hand {
		if c.Value == card.Value && c.Suit == card.Suit {
			return append(hand[:i], hand[i+1:]...)
		}
	}
	return hand
}
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
		log.Printf("Received message: Action: %s, Player: %s, Value: %d", msg.Action, msg.Player, msg.Value)
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
	log.Printf("\n\ngame: %v\n\n", game)
	if !gameExists {
		log.Printf("Game not found for client %s", msg.ClientID)
		return
	}

	//Controlla turno
	if game.Players[game.Turn].Name != msg.Player {
		log.Printf("Not %s's turn", msg.Player)
		return
	}
	fmt.Println(game.CardsPlayed, game.Turn)
	pickCard(game, msg.Value)
	if game.CardsPlayed == len(game.Players) {
		fmt.Printf("Il trick è pieno ed è: %v\n", game.CurrentTrick)
		winnerIndex := game.DetermineTrickWinner()
		log.Printf("Il vincitore è indice: %v", winnerIndex)
		game.ScoreTrick(winnerIndex)
		game.Turn = winnerIndex

		game.CardsPlayed = 0
		game.CurrentTrick = []Card{
			{Value: 0, Suit: ""},
			{Value: 0, Suit: ""},
			{Value: 0, Suit: ""},
			{Value: 0, Suit: ""},
		}
		if len(game.Deck) > 0 {
			game.DrawReset()
		} else {
			if len(game.Players[0].Hand) == 0 {
				fmt.Printf("Gioco finito")
				return
			}
		}
		broadcastGameState(game, c)

		log.Printf("Player %s wins the trick\n game turn is %d\n trick is %v\n cardsplayed is %d\n SCORE: %v", game.Players[winnerIndex].Name, game.Turn, game.CurrentTrick, game.CardsPlayed, game.Players[winnerIndex].Score)
		if game.Players[game.Turn].Name == "bot" {
			playBotTurn(game, c)
		}

	} else {
		// Advance to the next player's turn
		game.Turn = (game.Turn + 1) % len(game.Players) //g.Turn: chi ha vinto per ultimo, iTurn a chi tocca
		if game.Players[game.Turn].Name == "bot" {
			playBotTurn(game, c)

		}
	}
}

func playBotTurn(game *Game, c *Clients) {
	bot := &game.Players[game.Turn]
	pickNum := rand.Intn(len(bot.Hand))
	pickCard(game, pickNum) // Bot plays its chosen card
	if game.CardsPlayed == len(game.Players) {
		// Determine the winner of the trick
		fmt.Printf("Bot: Il trick è pieno ed è: %v\n", game.CurrentTrick)
		winnerIndex := game.DetermineTrickWinner()
		game.ScoreTrick(winnerIndex)
		// Set the next turn to the winner
		game.Turn = winnerIndex
		game.CardsPlayed = 0
		game.CurrentTrick = []Card{
			{Value: 0, Suit: ""},
			{Value: 0, Suit: ""},
			{Value: 0, Suit: ""},
			{Value: 0, Suit: ""},
		}
		// Draw cards for players if available
		if len(game.Deck) > 0 {
			game.DrawReset()
		} else {
			if len(game.Players[0].Hand) == 0 {
				fmt.Printf("Gioco finito")
				return
			}
		}
		// Notify clients of the updated game state
		//	broadcastGameState(game, c)
		// If the bot won, it should immediately start the next trick
		log.Printf("Player %s wins the trick\n game turn is %d\n trick is %v\n cardsplayed is %d\n SCORE: %v", game.Players[winnerIndex].Name, game.Turn, game.CurrentTrick, game.CardsPlayed, game.Players[winnerIndex].Score)
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
