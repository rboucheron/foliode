import { beforeEach, describe, expect, spyOn, test } from "bun:test"
import { useChatStore } from "./chat.store"
import * as chatApi from "./chat.api"

describe("chat store", () => {
  beforeEach(() => {
    useChatStore.getState().clearMessages()
    useChatStore.getState().setError(null)
  })

  test("initialise avec un message de bienvenue de l'assistant", () => {
    const { messages, isLoading, error } = useChatStore.getState()
    expect(messages.length).toBe(1)
    expect(messages[0].role).toBe("assistant")
    expect(isLoading).toBe(false)
    expect(error).toBeNull()
  })

  test("bloque l'envoi d'un message trop court et renseigne l'erreur", async () => {
    await useChatStore.getState().sendMessage("a")
    const { messages, error } = useChatStore.getState()
    expect(messages.length).toBe(1)
    expect(error).not.toBeNull()
  })

  test("ajoute le message utilisateur et la réponse de l'assistant lors d'un envoi réussi", async () => {
    const spy = spyOn(chatApi, "sendPortfolioChatMessage").mockImplementation(async () => ({
      answer: "Voici vos projets : 1. SuperApp",
    }))

    await useChatStore.getState().sendMessage("Quels sont mes projets ?")

    const { messages, isLoading, error } = useChatStore.getState()
    expect(isLoading).toBe(false)
    expect(error).toBeNull()
    expect(messages.length).toBe(3)
    expect(messages[1].role).toBe("user")
    expect(messages[1].content).toBe("Quels sont mes projets ?")
    expect(messages[2].role).toBe("assistant")
    expect(messages[2].content).toBe("Voici vos projets : 1. SuperApp")

    spy.mockRestore()
  })

  test("gère les erreurs d'API en ajoutant un message d'aide et l'état d'erreur", async () => {
    const spy = spyOn(chatApi, "sendPortfolioChatMessage").mockImplementation(async () => {
      throw new Error("Network Error")
    })

    await useChatStore.getState().sendMessage("Bonjour agent Foliode")

    const { messages, isLoading, error } = useChatStore.getState()
    expect(isLoading).toBe(false)
    expect(error).toBe("Network Error")
    expect(messages.length).toBe(3)
    expect(messages[2].role).toBe("assistant")
    expect(messages[2].status).toBe("error")

    spy.mockRestore()
  })

  test("clearMessages réinitialise la conversation", () => {
    useChatStore.setState({
      messages: [
        { id: "1", role: "user", content: "Test", timestamp: 123 },
        { id: "2", role: "assistant", content: "Reponse", timestamp: 124 },
      ],
      error: "old error",
    })

    useChatStore.getState().clearMessages()

    const { messages, error } = useChatStore.getState()
    expect(messages.length).toBe(1)
    expect(messages[0].role).toBe("assistant")
    expect(error).toBeNull()
  })
})
