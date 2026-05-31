<?php

namespace App\Portfolio\Controller;

use App\Portfolio\Dto\CreatePortfolioCommentDTO;
use App\Portfolio\Service\CommentService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
class CommentController extends AbstractController
{
    public function __construct(
        private CommentService $commentService,
        private SerializerInterface $serializer,
    ) {
    }

    #[Route('/v1/api/public/portfolio/{url}/comments', methods: ['GET'])]
    public function getPublicComments(string $url): JsonResponse
    {
        return new JsonResponse(
            $this->commentService->serializeComments(
                $this->commentService->getPublicComments($url)
            ),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/v1/api/public/portfolio/{url}/comments', methods: ['POST'])]
    public function createPublicComment(string $url, Request $request): JsonResponse
    {
        $data = $request->request->all();
        $commentDto = $this->serializer->denormalize($data, CreatePortfolioCommentDTO::class);
        $avatarFile = $request->files->get('avatar');

        return new JsonResponse(
            $this->commentService->serializeComment(
                $this->commentService->createComment($url, $this->getUser(), $commentDto, $avatarFile)
            ),
            Response::HTTP_CREATED,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/comments', methods: ['GET'])]
    public function getDashboardComments(): JsonResponse
    {
        return new JsonResponse(
            $this->commentService->serializeComments(
                $this->commentService->getPortfolioComments($this->getUser())
            ),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/comments/{id}/hide', methods: ['PATCH'])]
    public function hideComment(string $id): JsonResponse
    {
        return new JsonResponse(
            $this->commentService->serializeComment(
                $this->commentService->hideComment($this->getUser(), $id)
            ),
            Response::HTTP_OK,
            [],
            true
        );
    }
}