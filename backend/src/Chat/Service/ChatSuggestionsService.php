<?php

namespace App\Chat\Service;

use App\Repository\ChatSuggestionsRepository;
use Symfony\Component\Serializer\SerializerInterface;

class ChatSuggestionsService
{
    public function __construct(
        private readonly ChatSuggestionsRepository $chatSuggestionsRepository, 
        private readonly SerializerInterface $serializer,
    ) {
    }

    /**
     * @return list<\\App\\Entity\\ChatSuggestions>
     */
    public function getChatSuggestions(): array
    {
        return $this->chatSuggestionsRepository->findBy(['isActive' => true]);
    }

    /**
     * @return list<\\App\\Entity\\ChatSuggestions>
     */
    public function getChatSuggestionsByContext(string $contextType): array
    {
        return $this->chatSuggestionsRepository->findBy(['is_active' => true, 'context_type' => $contextType]);
    }

    /**
     * @param list<\\App\\Entity\\ChatSuggestions> $chatSuggestions
     */
    public function serializeChatSuggestions(array $chatSuggestions): string
    {
        return $this->serializer->serialize($chatSuggestions, 'json', ['groups' => ['chat_suggestions']]);
    }
}