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
	Deck     Deck
	Players  []Player
	Briscola Card
	Trick    []Card
}
