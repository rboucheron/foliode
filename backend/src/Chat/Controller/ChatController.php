<?php

namespace App\Chat\Controller;

use App\Chat\Dto\PortfolioChatRequest;
use App\Chat\Service\PortfolioChatService;
use App\Entity\Portfolio\PortfolioStatus;
use App\Portfolio\Service\PortfolioService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Service\BaseControllerWithAuth;

final class ChatController extends BaseControllerWithAuth
{
    public function __construct(
        private PortfolioChatService $portfolioChatService,
        private PortfolioService $portfolioService,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/chat', methods: ['POST'])]
    public function chat(Request $request): JsonResponse
    {
        $portfolioChatRequest = $this->serializer->deserialize(
            $request->getContent(),
            PortfolioChatRequest::class,
            'json'
        );

        $violations = $this->validator->validate($portfolioChatRequest);
        if (count($violations) > 0) {
            return new JsonResponse([
                'error' => (string) $violations,
            ], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->getAuthenticatedUser();

        $portfolio = $this->portfolioService->getPortfolioByUser($user);
        $locale = $portfolioChatRequest->locale ?: ($request->getPreferredLanguage(['fr', 'en']) ?? 'fr');

        $response = $this->portfolioChatService->respond(
            $portfolio,
            $portfolioChatRequest->message,
            $locale,
        );

        if (($response['action'] ?? null) === 'publish') {
            $this->portfolioService->updateStatus($portfolio, PortfolioStatus::PUBLISHED);
        }

        return new JsonResponse($response);
    }
}
