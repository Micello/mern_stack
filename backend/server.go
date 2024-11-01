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
	Bastoni Suit = "Bastoni"
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
	Turn         int
}

func NewGame(playerNames []string) *Game {
	deck := NewDeck()
	deck.Shuffle()

	players := []Player{}
	for _, name := range playerNames {
		players = append(players, Player{Name: name})
	}

	for i := 0; i < len(players); i++ {
		players[i].Hand = deck[:3] //la carta 0 è quella più in alto
		deck = deck[3:]
	}

	briscola := deck[len(deck)-1] //l'ultima quella più in basso
	turn := 0

	return &Game{
		Deck:     deck,
		Players:  players,
		Briscola: briscola,
		Turn:     turn,
	}
}

func (g *Game) PlayRound(picks []int) int {
	g.CurrentTrick = []Card{}

	for i := range g.Players {
		iturn := (i + g.Turn) % len(g.Players)
		card := g.Players[iturn].Hand[picks[i]] //NOTA: l'indice di picks non indica il giocatore ma il turno
		g.Players[iturn].Hand = append(g.Players[iturn].Hand[:picks[i]], g.Players[iturn].Hand[picks[i]+1:]...)
		g.CurrentTrick = append(g.CurrentTrick, card) //NOTA: l'indice di CurrentTrick non indica il giocatore
		fmt.Printf("%s gioca il %v di %v\n", g.Players[iturn].Name, card.Value, card.Suit)
	}

	winnerIndex := g.DetermineTrickWinner()
	fmt.Printf("%s vince la mano!\n", g.Players[winnerIndex].Name)
	g.Turn = winnerIndex
	return winnerIndex
}

func (g *Game) DetermineTrickWinner() int {
	winningCard := g.CurrentTrick[0]
	winnerIndex := 0
	fmt.Printf("\nTrick: %v -> ", g.CurrentTrick)
	//scambia 3  con 11 e 1 (asso) con 12 per un controllo corretto
	getRank := func(card Card) int {
		switch card.Value {
		case 1:
			return 12 // Ace is ranked highest
		case 3:
			return 11 // Three is ranked just below Ace
		default:
			return card.Value
		}
	}

	for i, card := range g.CurrentTrick {
		winningRank := getRank(winningCard)
		cardRank := getRank(card)

		if card.Suit == winningCard.Suit && cardRank > winningRank {
			winningCard = card
			winnerIndex = i
		} else if (card.Suit == g.Briscola.Suit && cardRank > winningRank) || (card.Suit == g.Briscola.Suit && winningCard.Suit != g.Briscola.Suit) {
			winningCard = card
			winnerIndex = i
		}
	}
	return (winnerIndex + g.Turn) % len(g.Players)
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
		return 0
	}
}

func (g *Game) ScoreTrick(i int) {
	for _, card := range g.CurrentTrick {
		g.Players[i].Score += CalculateScore(card)
	}
	g.CurrentTrick = nil
}

func (g *Game) Draw() {
	for i := range g.Players {
		g.Players[i].Hand = append(g.Players[i].Hand, g.Deck[0])
		g.Deck = g.Deck[1:]
	}
	g.CurrentTrick = nil
}

func main() {
	game := NewGame([]string{"Alice", "Bob"})
	fmt.Printf("La briscola è: %v\n\n", game.Briscola)
	fmt.Printf("Mani iniziali: %v \n\n", game.Players)
	var winner int
	picks := []int{}
	var pick int
	for len(game.Deck) > 0 {
		for i := range game.Players {
			iturn := (i + game.Turn) % len(game.Players)

			// Display the player's hand and prompt for input
			fmt.Printf("%v\n", game.Players[iturn].Hand)
			fmt.Printf("%s, scegli una carta (0, 1, or 2): ", game.Players[iturn].Name)

			// Input validation loop
			for {
				_, err := fmt.Scan(&pick)
				if err == nil && (pick == 0 || pick == 1 || pick == 2) {
					break // Valid input, exit the loop
				} else {
					fmt.Println("Input non valido. Per favore inserisci 0, 1, o 2.")
				}
			}

			// Append the valid pick to picks slice
			picks = append(picks, pick)
		}
		winner = game.PlayRound(picks)
		picks = nil
		game.ScoreTrick(winner)
		game.Draw()
		fmt.Printf("%s: %v %d punti\n", game.Players[0].Name, game.Players[0].Hand, game.Players[0].Score)
		fmt.Printf("%s: %v %d punti\n\n", game.Players[1].Name, game.Players[1].Hand, game.Players[1].Score)
	}
	for len(game.Players[0].Hand) != 0 {
		for i := range game.Players {
			iturn := (i + game.Turn) % len(game.Players)

			fmt.Printf("%v\n", game.Players[iturn].Hand)
			fmt.Printf("%s, scegli una carta (0, 1, or 2): ", game.Players[iturn].Name)

			for {
				_, err := fmt.Scan(&pick)
				if err == nil && (pick < len(game.Players[0].Hand)) {
					break // Valid input, exit the loop
				} else {
					fmt.Println("Input non valido. Hai un numero di carte in mano pari a", len(game.Players[0].Hand))
				}
			}

			picks = append(picks, pick)
		}
		winner = game.PlayRound(picks)
		picks = nil
		game.ScoreTrick(winner)
		fmt.Printf("%s: %v %d punti\n", game.Players[0].Name, game.Players[0].Hand, game.Players[0].Score)
		fmt.Printf("%s: %v %d punti\n\n", game.Players[1].Name, game.Players[1].Hand, game.Players[1].Score)
	}
	fmt.Println("Final Scores:")
	for _, player := range game.Players {
		fmt.Printf("%s: %d\n", player.Name, player.Score)
	}
}
