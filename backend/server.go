package main

import (
	"fmt"
	//	"github.com/gorilla/websocket"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gorilla/websocket"
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

type Message struct {
	Action   string `json:"action"`
	Value    int    `json:"value"`
	Player   string `json:"player"`
	ClientID string `json:"clientId"`
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
	Id           int
	Deck         Deck
	Players      []Player
	Briscola     Card
	CurrentTrick []Card
	CardsPlayed  int
	Turn         int
}

type GameCollection map[int]*Game

type ClientInfo struct {
	Conn   *websocket.Conn
	GameId int
}

type Clients struct {
	mu      sync.Mutex
	clients map[string]ClientInfo //Per cercare e collegare client(s) e game.
}

func NewGame(playerNames []string, isBot []bool, gc *int) *Game {
	*gc++
	id := *gc //NOTA: se più di un HandleMesages goroutine viene eseguita, necessita mutex.
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
	cardsPlayed := 0
	return &Game{
		Id:           id,
		Deck:         deck,
		Players:      players,
		Briscola:     briscola,
		CurrentTrick: make([]Card, 4),
		CardsPlayed:  cardsPlayed,
		Turn:         turn,
	}
}

func (g *Game) DetermineTrickWinner() int {
	firstTrickPlayer := (g.Turn + 1) % len(g.Players)
	winningCard := g.CurrentTrick[firstTrickPlayer] //la carta vincente è quella del successivo all'ultimo che ha giocato, ossia la prima del trick
	winnerIndex := firstTrickPlayer
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
		return 0
	}
}

func (g *Game) ScoreTrick(i int) {
	for _, card := range g.CurrentTrick {
		g.Players[i].Score += CalculateScore(card)
	}
	g.CurrentTrick = []Card{
		{Value: 0, Suit: ""},
		{Value: 0, Suit: ""},
		{Value: 0, Suit: ""},
		{Value: 0, Suit: ""},
	}
}

func (g *Game) DrawReset() {
	for i := range g.Players {
		g.Players[i].Hand = append(g.Players[i].Hand, g.Deck[0])
		g.Deck = g.Deck[1:]
	}
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

func (c *Clients) SafeAdd(ws *websocket.Conn) string {
	c.mu.Lock()                            // Lock to ensure thread-safe access to the map
	defer c.mu.Unlock()                    // Ensure unlocking happens after the modification
	clientID := strconv.Itoa(rand.Intn(1)) // Inside the lock, check if ID exists already, or generate a new one (if needed)
	c.clients[clientID] = ClientInfo{Conn: ws, GameId: -1}
	log.Printf("SafeAdd: Added client %s to the map %v", clientID, c.clients)
	return clientID
}

func (games GameCollection) PrintGames() {
	for id, game := range games {
		fmt.Printf("PrintGames()\nGame ID: %d, Game Details: Briscola: %v \n Deck cards number:%+v\n Hands: %v \n, Trick: %v \n Turn: %d,\n CardsPlayed: %d\n", id, game.Briscola, len(game.Deck), game.Players, game.CurrentTrick, game.Turn, game.CardsPlayed)
	}
}

func (c *Clients) PrintClients() {
	for id, client := range c.clients {
		fmt.Printf("PrintClients()\nClient ID: %s, Client Info: %v \n", id, client)
	}
}

func main() {
	games := GameCollection{}
	a := 1
	fmt.Print(a)
	var gameCounter int
	c := Clients{
		clients: make(map[string]ClientInfo),
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./index.html") // Serve the HTML file
	})
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("."))))

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		handleConnections(w, r, &c)
	})

	port := ":8080"
	fmt.Printf("Server starting on port %s...\n", port)
	go handleMessages(games, &c, &gameCounter)
	err := http.ListenAndServe(port, nil) //avvio deL server: ogni connessione in arrivo viene avviata in una goroutine separata DI DEFAULT e quindi al suo interno handleConnections
	if err != nil {
		log.Fatal("Server error:", err)
	}

	log.Println("ciaoinmain")
	/*
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
	*/
}
