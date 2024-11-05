
func main() {
	playerNames, isBot := setupPlayers() // Step 1: Set up players
	game := NewGame(playerNames, isBot)  // Step 2: Initialize the game

	fmt.Printf("La briscola è: %v\n\n", game.Briscola)
	displayHands(game)

	// Play rounds until the deck is empty
	for len(game.Deck) > 0 {
		playRound(game)     // Step 3: Play a round
		drawNewCards(game)  // Step 4: Draw new cards
		displayScores(game) // Step 5: Display current scores and hands
	}

	// Play remaining cards in hands after deck is exhausted
	for len(game.Players[0].Hand) > 0 {
		playRound(game)
		displayScores(game)
	}

	// Display final scores
	displayFinalScores(game)
}

// Helper functions to organize main steps of the game

func setupPlayers() ([]string, []bool) {
	var playerCount int
	var gameMode bool
	fmt.Print("CPU o giocatore?") // false = CPU
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
			playerNames = append(playerNames, "bot")
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

func displayHands(game *Game) {
	for _, player := range game.Players {
		fmt.Printf("%s: %v\n", player.Name, player.Hand)
	}
}

func playRound(game *Game) {
	picks := []int{}
	for i := range game.Players {
		iturn := (i + game.Turn) % len(game.Players)
		pick := chooseCard(game.Players[iturn])
		picks = append(picks, pick)
	}
	winner := game.PlayRound(picks)
	game.ScoreTrick(winner)
}

func chooseCard(player Player) int {
	var pick int
	if player.Bot {
		rand.Seed(time.Now().UnixNano())
		pick = rand.Intn(len(player.Hand))
		fmt.Printf("%s gioca %v\n", player.Name, player.Hand[pick])
	} else {
		fmt.Printf("%v\n", player.Hand)
		fmt.Printf("%s, scegli una carta (0, 1, or 2): ", player.Name)
		for {
			_, err := fmt.Scan(&pick)
			if err == nil && pick >= 0 && pick < len(player.Hand) {
				break
			} else {
				fmt.Println("Input non valido. Per favore inserisci un valore corretto.")
			}
		}
		fmt.Printf("%s gioca %v\n", player.Name, player.Hand[pick])
	}
	return pick
}

func drawNewCards(game *Game) {
	game.Draw()
}

func displayScores(game *Game) {
	for _, player := range game.Players {
		fmt.Printf("%s: %v %d punti\n", player.Name, player.Hand, player.Score)
	}
	fmt.Println()
}

func displayFinalScores(game *Game) {
	fmt.Println("Final Scores:")
	for _, player := range game.Players {
		fmt.Printf("%s: %d punti\n", player.Name, player.Score)
	}
}
