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
	Bot   bool
}

type Game struct {
	Deck         Deck
	Players      []Player
	Briscola     Card
	CurrentTrick []Card
	Turn         int
}

func NewGame(playerNames []string, isBot []bool) *Game {
	deck := NewDeck()
	deck.Shuffle()

	players := []Player{}
	for i, name := range playerNames {
		players = append(players, Player{Name: name, Bot: isBot[i]})
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

func setupPlayers() ([]string, []bool) {
	var playerCount int
	var gameMode bool
	fmt.Print("CPU o giocatore?  ") // false = CPU
	fmt.Scan(&gameMode)
	fmt.Print("Seleziona numero giocatori (2 o 4)") // no error handling here
	fmt.Scan(&playerCount)

	playerNames := []string{}
	isBot := []bool{}
	if !gameMode {
		var name string
		fmt.Print("Nome del giocatore 1: ")
		fmt.Scan(&name)
		playerNames = append(playerNames, name)
		isBot = append(isBot, false)
		for i := 1; i < playerCount; i++ {
			botName := fmt.Sprintf("bot%d", i)
			playerNames = append(playerNames, botName)
			isBot = append(isBot, true)
		}
	} else {
		for i := 0; i < playerCount; i++ {
			var name string
			fmt.Printf("Nome del giocatore %d: ", i+1)
			fmt.Scan(&name)
			playerNames = append(playerNames, name)
			isBot = append(isBot, false)
		}
	}
	return playerNames, isBot
}

func playRound(game *Game) {
	picks := []int{}
	fmt.Printf("TURNO di: %d\n", game.Turn)
	fmt.Printf("Briscola: %v\n", game.Briscola.Suit)
	for i := range game.Players {
		iturn := (i + game.Turn) % len(game.Players)
		pick := chooseCard(game.Players[iturn])
		picks = append(picks, pick)
	}
	winner := game.PlayRound(picks)
	game.ScoreTrick(winner)
}

func (g *Game) PlayRound(picks []int) int {
	g.CurrentTrick = []Card{}

	for i := range g.Players {
		iturn := (i + g.Turn) % len(g.Players)
		card := g.Players[iturn].Hand[picks[i]] //NOTA: l'indice di picks non indica il giocatore ma il turno
		g.Players[iturn].Hand = append(g.Players[iturn].Hand[:picks[i]], g.Players[iturn].Hand[picks[i]+1:]...)
		g.CurrentTrick = append(g.CurrentTrick, card) //NOTA: l'indice di CurrentTrick non indica il giocatore
	}

	winnerIndex := g.DetermineTrickWinner()
	fmt.Printf("%s vince la mano!\n", g.Players[winnerIndex].Name)
	g.Turn = winnerIndex
	return winnerIndex
}
func chooseCard(player Player) int {
	var pick int
	if player.Bot {
		rand.Seed(time.Now().UnixNano())
		pick = rand.Intn(len(player.Hand))
	} else {
		fmt.Printf("%v\n", player.Hand)
		fmt.Printf("%s, scegli una carta (0, 1, or 2): \n", player.Name)
		for {
			_, err := fmt.Scan(&pick)
			if err == nil && pick >= 0 && pick < len(player.Hand) {
				break
			} else {
				fmt.Println("Input non valido. Per favore inserisci un valore corretto.")
			}
		}
	}
	time.Sleep(500 * time.Millisecond)
	fmt.Printf("%s gioca %v\n", player.Name, player.Hand[pick])
	return pick
}

func displayScores(game *Game) {
	if len(game.Players) == 2 {
		for _, player := range game.Players {
			fmt.Printf("%s: %d punti\n", player.Name, player.Score)
		}
	} else {
		fmt.Printf("Team 1: %d punti\n", game.Players[0].Score+game.Players[2].Score)
		fmt.Printf("Team 2: %d punti\n", game.Players[1].Score+game.Players[3].Score)
	}
}
func displayHands(game *Game) {
	for _, player := range game.Players {
		fmt.Printf("mano di %s: %v \n", player.Name, player.Hand)
	}
}
func main() {
	playerNames, isBot := setupPlayers() // Step 1: Set up players
	game := NewGame(playerNames, isBot)
	fmt.Printf("La briscola è: %v\n\n", game.Briscola)
	displayHands(game)
	for len(game.Deck) > 0 {
		playRound(game) // Step 3: Play a round
		game.Draw()
		displayScores(game)
	}

	// Play remaining cards in hands after deck is exhausted
	for len(game.Players[0].Hand) > 0 {
		playRound(game)
		displayScores(game)
	}
}
