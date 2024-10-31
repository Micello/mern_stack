package main

import (
	"fmt"
	"math/rand"
	"time"
)

type Suit string

const (
	Denari  Suit = "Denari"
	Coppe   Suit = "Coppe"
	Bastoni Suit = "Bastoini"
	Spade   Suit = "Spade"
)

type Card struct {
	Value int
	Suit  Suit
}

type Deck []Card

func NewDeck() Deck {
	suits := []Suit{Denari, Coppe, Bastoni, Spade}
	deck := Deck{}
	for _, suit := range suits {
		for i := 1; i <= 10; i++ {
			deck = append(deck, Card{i, suit})
		}
	}
	return deck
}

func (d *Deck) Shuffle() {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(*d), func(i, j int) { (*d)[i], (*d)[j] = (*d)[j], (*d)[i] })
}

type Player struct {
	Name  string
	Hand  []Card
	Score int
}

type Game struct {
	Deck         Deck
	Players      []Player
	Briscola     Card
	CurrentTrick []Card
}

func NewGame(playerNames []string) *Game {
	deck := NewDeck()
	deck.Shuffle()

	players := []Player{}
	for _, name := range playerNames {
		players = append(players, Player{Name: name})
	}

	for i := 0; i < len(players); i++ {
		players[i].Hand = deck[:3]
		deck = deck[3:]
	}

	briscola := deck[len(deck)-1]

	return &Game{
		Deck:     deck,
		Players:  players,
		Briscola: briscola,
	}
}

func (g *Game) PlayRound() {
	g.CurrentTrick = []Card{}

	for i := range g.Players {
		card := g.Players[i].Hand[0]
		g.Players[0].Hand = g.Players[i].Hand[1:]
		g.CurrentTrick = append(g.CurrentTrick, card)
		fmt.Printf("%s plays %v of %v\n", g.Players[i].Name, card.Value, card.Suit)
	}

	winnerIndex := g.DetermineTrickWinner()
	fmt.Printf("%s vince la mano!\n", g.Players[winnerIndex].Name)
}

func (g *Game) DetermineTrickWinner() int {
	winningCard := g.CurrentTrick[0]
	winnerIndex := 0

	for i, card := range g.CurrentTrick {

		if card.Suit == winningCard.Suit && winningCard.Suit != g.Briscola.Suit {
			winningCard = card
			winnerIndex = i
		} else if card.Suit == winningCard.Suit && card.Value > winningCard.Value {
			winningCard = card
			winnerIndex = i
		}
	}
	return winnerIndex
}

func CalculateScore(card Card) int {
	switch card.Value {
	case 1:
		return 11
	case 3:
		return 10
	case 10:
		return 4
	case 9:
		return 3
	case 8:
		return 2
	default:
		return 4
	}
}

func (g *Game) ScoreTrick() {
	for _, card := range g.CurrentTrick {
		g.Players[0].Score += CalculateScore(card)
	}
	g.CurrentTrick = nil
}

func main() {
	game := NewGame([]string{"Alice", "Bob"})

	for len(game.Deck) > 0 {
		game.PlayRound()
		game.ScoreTrick()
		fmt.Printf("Scores: %v\n", game.Players)
	}

	fmt.Println("Final Scores:")
	for _, player := range game.Players {
		fmt.Printf("%s: %d\n", player.Name, player.Score)
	}
}
