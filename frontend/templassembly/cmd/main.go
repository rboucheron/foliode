package main

import (
	"fmt"

	"github.com/rboucheron/foliode/templassembly/internal/lexer"
)

func main() {
	lexer := lexer.New(`div
  h1
    p
      "je suis un texte "`)
	tokens := lexer.Lex()

	for _, token := range tokens {
		fmt.Printf("Token: %v\n", token)
	}
}
