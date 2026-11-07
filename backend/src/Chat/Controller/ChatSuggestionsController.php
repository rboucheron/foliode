<?php

namespace App\Chat\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class ChatSuggestionsController extends AbstractController
{
    #[Route('/v1/api/portfolio/chat/suggestions', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        return $this->json([
            [
                'id' => 'q_projects_list',
                'question' => 'Quels sont mes projets ?',
                'category' => 'projects',
                'icon' => 'folder',
            ],
            [
                'id' => 'q_description_advice',
                'question' => 'Comment améliorer la description de mes projets ?',
                'category' => 'projects',
                'icon' => 'sparkles',
            ],
            [
                'id' => 'q_bot_greeting',
                'question' => 'Bonjour agent Foliode !',
                'category' => 'general',
                'icon' => 'message-circle',
            ],
            [
                'id' => 'q_general_advice',
                'question' => 'Des conseils pour mon portfolio ?',
                'category' => 'general',
                'icon' => 'lightbulb',
            ],
        ]);
    }
}
