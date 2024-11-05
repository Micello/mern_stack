package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins
	},
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan Message)

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading to websocket: %v", err)
		return
	}
	defer ws.Close()

	// Register new client
	clients[ws] = true

	// Listen for messages from the client
	for {
		var msg Message
		err := ws.ReadJSON(&msg) //blocking operation
		log.Printf("Received message: Action: %s, Player: %s, Value: %d, Suit: %s", msg.Action, msg.Player, msg.Value, msg.Suit)

		if err != nil {
			log.Printf("Error reading JSON: %v", err)
			delete(clients, ws)
			break
		}

		// Instead of handling the message directly, send it to the broadcast channel
		broadcast <- msg
	}
}

func handlePickCard(msg Message) {
	// Construct the card from the message
	pickedCard := Card{
		Value: msg.Value,
		Suit:  msg.Suit,
	}
	log.Printf("Player %s picked the card: %v of %s", msg.Player, pickedCard.Value, pickedCard.Suit)

	// Game logic can be implemented here or triggered here if necessary
}

func handleMessages() {
	for {
		msg := <-broadcast
		// Handle different actions based on msg.Action
		switch msg.Action {
		case "pick_card":
			handlePickCard(msg)
		default:
			log.Println("Unknown action:", msg.Action)
		}

		// Broadcast the message to all connected clients
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("Error writing JSON: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
