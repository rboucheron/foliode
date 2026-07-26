package main

import (
	"fmt"
	"os"

	"github.com/rboucheron/foliode/templassembly/internal/lexer"
)

func main() {
	content, err := os.ReadFile("exemple.txt")
	if err != nil {
		fmt.Println("Erreur lors de la lecture :", err)
		return
	}
	lexer := lexer.New(string(content))
	tokens := lexer.Lex()
	for _, token := range tokens {
		fmt.Printf("Token: %+v\n", token)
	}
}
