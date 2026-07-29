package lexer

import "github.com/rboucheron/foliode/templassembly/internal/token"

type Lexer struct {
	input    []rune
	position int

	line   int
	column int

	atLineStart bool
}

func New(text string) *Lexer {
	return &Lexer{
		input:       []rune(text),
		position:    0,
		line:        1,
		column:      1,
		atLineStart: true,
	}
}

func (l *Lexer) Lex() []token.Token {
	tokens := []token.Token{}

	for !l.isEOF() {

		indent := 0

		if l.atLineStart {

			indent = l.readIndent()
			l.atLineStart = false

			if l.isEOF() {
				break
			}
		}

		char := l.current()

		switch {

		case char == '"':

			column := l.column

			str := l.readString()

			tokens = append(tokens, token.Token{
				Type:   token.STRING,
				Value:  str,
				Line:   l.line,
				Column: column,
				Indent: indent,
			})

		case isLetter(char):

			column := l.column

			word := l.readIdentifier()

			tokens = append(tokens, token.Token{
				Type:   token.IDENTIFIER,
				Value:  word,
				Line:   l.line,
				Column: column,
				Indent: indent,
			})

		default:

			l.advance()
		}
	}

	tokens = append(tokens, token.Token{
		Type: token.EOF,
		Line: l.line,
	})

	return tokens
}

func (l *Lexer) readIndent() int {

	indent := 0

	for !l.isEOF() {

		char := l.current()

		switch char {

		case ' ':
			indent++
			l.advance()

		case '\t':
			indent += 4
			l.advance()

		default:
			return indent
		}
	}

	return indent
}

func (l *Lexer) current() rune {
	return l.input[l.position]
}

func (l *Lexer) advance() {

	if l.isEOF() {
		return
	}

	if l.current() == '\n' {
		l.line++
		l.column = 1
	} else {
		l.column++
	}

	l.position++
}

func (l *Lexer) isEOF() bool {
	return l.position >= len(l.input)
}

func isLetter(char rune) bool {

	return (char >= 'a' && char <= 'z') ||
		(char >= 'A' && char <= 'Z') ||
		(char >= '0' && char <= '9') ||
		char == '_'
}

func (l *Lexer) readIdentifier() string {

	var value []rune

	for !l.isEOF() {

		char := l.current()

		if isLetter(char) {

			value = append(value, char)
			l.advance()

		} else {
			break
		}
	}

	return string(value)
}

func (l *Lexer) readString() string {

	var value []rune

	l.advance()

	for !l.isEOF() {

		char := l.current()

		if char == '"' {

			l.advance()

			break
		}

		value = append(value, char)

		l.advance()
	}

	return string(value)
}
