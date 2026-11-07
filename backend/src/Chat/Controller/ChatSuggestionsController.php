<?php

namespace App\Chat\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Chat\Service\ChatSuggestionsService;
use Symfony\Component\Serializer\SerializerInterface;
use App\Chat\Dto\ChatSuggestions;

final class ChatSuggestionsController extends AbstractController
{
    public function __construct(
        private ChatSuggestionsService $chatSuggestionsService,
        private SerializerInterface $serializer,
    ) {
    }


    #[Route('/v1/api/portfolio/chat/suggestions/by-context', methods: ['PATCH'])]
    public function suggestionsByContext(Request $request): JsonResponse
    {
        $contextType = $this->serializer->deserialize(
            $request->getContent(),
            ChatSuggestions::class,
            'json'
        )['contextType'] ?? '';

        if (empty($contextType)) {
            return new JsonResponse(['error' => 'contextType is required.'], Response::HTTP_BAD_REQUEST);
        }

        $suggestions = $this->chatSuggestionsService->getChatSuggestionsByContext($contextType);

        return new JsonResponse(
            $this->chatSuggestionsService->serializeChatSuggestions($suggestions), 
            Response::HTTP_OK
        );
    }
}
