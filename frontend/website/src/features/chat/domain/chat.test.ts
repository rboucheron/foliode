import { describe, expect, test } from "bun:test"
import {
  DEFAULT_SUGGESTED_QUESTIONS,
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
  createChatMessage,
  formatChatAnswer,
  validateChatMessage,
} from "./chat"

describe("chat domain rules", () => {
  describe("validateChatMessage", () => {
    test("rejette un message vide ou composé uniquement d'espaces", () => {
      expect(validateChatMessage("").isValid).toBe(false)
      expect(validateChatMessage("   ").isValid).toBe(false)
      expect(validateChatMessage("\n\t").isValid).toBe(false)
    })

    test("rejette un message de moins de MIN_MESSAGE_LENGTH caractères utiles", () => {
      const result = validateChatMessage("a")
      expect(result.isValid).toBe(false)
      expect(result.error).toContain(`${MIN_MESSAGE_LENGTH} caractères`)
    })

    test("accepte un message valide", () => {
      const result = validateChatMessage("Quels sont mes projets ?")
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    test("accepte un message avec des espaces aux extrémités tant que le contenu est suffisant", () => {
      const result = validateChatMessage("  ok  ")
      expect(result.isValid).toBe(true)
    })

    test("rejette un message dépassant MAX_MESSAGE_LENGTH caractères", () => {
      const longMessage = "a".repeat(MAX_MESSAGE_LENGTH + 1)
      const result = validateChatMessage(longMessage)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain(`${MAX_MESSAGE_LENGTH} caractères`)
    })

    test("accepte un message à la limite exacte de MAX_MESSAGE_LENGTH", () => {
      const exactMessage = "a".repeat(MAX_MESSAGE_LENGTH)
      const result = validateChatMessage(exactMessage)
      expect(result.isValid).toBe(true)
    })
  })

  describe("createChatMessage", () => {
    test("crée un message utilisateur avec statut par défaut sent", () => {
      const msg = createChatMessage("user", "Hello Foliode")
      expect(msg.role).toBe("user")
      expect(msg.content).toBe("Hello Foliode")
      expect(msg.status).toBe("sent")
      expect(msg.id).toStartWith("msg_")
      expect(typeof msg.timestamp).toBe("number")
    })

    test("permet de spécifier un statut et un message d'erreur", () => {
      const msg = createChatMessage("user", "Test", "error", "Erreur réseau")
      expect(msg.status).toBe("error")
      expect(msg.errorMessage).toBe("Erreur réseau")
    })

    test("nettoie les espaces superflus autour du contenu", () => {
      const msg = createChatMessage("assistant", "  Voici vos projets   ")
      expect(msg.content).toBe("Voici vos projets")
    })
  })

  describe("formatChatAnswer", () => {
    test("retourne une chaîne vide si l'entrée est vide", () => {
      expect(formatChatAnswer("")).toBe("")
    })

    test("normalise les retours à la ligne et espaces multiples", () => {
      const raw = "Voici vos projets :\r\n\n\n1. Projet A   - Super projet\n\n\n2. Projet B"
      const formatted = formatChatAnswer(raw)
      expect(formatted).toBe("Voici vos projets :\n\n1. Projet A - Super projet\n\n2. Projet B")
    })
  })

  describe("DEFAULT_SUGGESTED_QUESTIONS", () => {
    test("contient des questions prédéfinies non vides et valides", () => {
      expect(DEFAULT_SUGGESTED_QUESTIONS.length).toBeGreaterThanOrEqual(3)
      for (const item of DEFAULT_SUGGESTED_QUESTIONS) {
        expect(item.id).toBeTruthy()
        expect(item.question.length).toBeGreaterThanOrEqual(MIN_MESSAGE_LENGTH)
        expect(validateChatMessage(item.question).isValid).toBe(true)
      }
    })
  })
})
