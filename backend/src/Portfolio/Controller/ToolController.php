<?php

namespace App\Portfolio\Controller;

use App\Portfolio\Dto\ToolDTO;
use App\Portfolio\Service\ToolService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

class ToolController extends AbstractController
{
    public function __construct(
        private ToolService $toolService,
        private SerializerInterface $serializer,
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/tools', methods: ['GET'])]
    public function getTools(): JsonResponse
    {
        return new JsonResponse(
            $this->toolService->serializeTools(
                $this->toolService->getPortfolioTools($this->getUser())
            ),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/tools', methods: ['POST'])]
    public function createTool(Request $request): JsonResponse
    {
        $tool = $this->toolService->createTool(
            $this->getUser(),
            $this->serializer->deserialize($request->getContent(), ToolDTO::class, 'json')
        );

        return new JsonResponse(
            $this->toolService->serializeTool($tool),
            Response::HTTP_CREATED,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/tools/batch', methods: ['POST'])]
    public function createTools(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (!is_array($payload)) {
            return new JsonResponse(['error' => 'Invalid payload, expected an array of tools'], Response::HTTP_BAD_REQUEST);
        }

        $toolsDto = [];
        foreach ($payload as $item) {
            $toolsDto[] = $this->serializer->deserialize(
                json_encode($item, JSON_THROW_ON_ERROR),
                ToolDTO::class,
                'json'
            );
        }

        return new JsonResponse(
            $this->toolService->serializeTools($this->toolService->createTools($this->getUser(), $toolsDto)),
            Response::HTTP_CREATED,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/tools/{id}', methods: ['PUT'])]
    public function updateTool(string $id, Request $request): JsonResponse
    {
        $tool = $this->toolService->updateTool(
            $this->getUser(),
            $id,
            $this->serializer->deserialize($request->getContent(), ToolDTO::class, 'json')
        );

        return new JsonResponse(
            $this->toolService->serializeTool($tool),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/tools/{id}', methods: ['DELETE'])]
    public function deleteTool(string $id): JsonResponse
    {
        $this->toolService->deleteTool($this->getUser(), $id);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
