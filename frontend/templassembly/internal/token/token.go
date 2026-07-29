package token

type TokenType int

const (
	IDENTIFIER TokenType = iota
	STRING
	INDENT
	DEDENT
	NEWLINE
	EOF
)

type Token struct {
	Type  TokenType
	Value string
	Line   int
	Column int
	Indent int
}
