<?php

namespace App\Site\Controller;

use App\Service\BaseControllerWithAuth;
use App\Site\DTO\CreateSiteDTO;
use App\Site\Service\SiteService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
#[Route('/v1/api/sites')]
final class SiteController extends BaseControllerWithAuth
{
    public function __construct(private SiteService $sites) {}

    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $items = array_map(static fn($site) => ['id' => $site->getId(), 'title' => $site->getTitle(), 'url' => $site->getUrl()], $this->sites->list($this->getAuthenticatedUser()));
        return new JsonResponse($items);
    }

    #[Route('', methods: ['POST'])]
    public function create(#[MapRequestPayload] CreateSiteDTO $dto): JsonResponse
    {
        $site = $this->sites->create($this->getAuthenticatedUser(), $dto);
        return new JsonResponse(['id' => $site->getId(), 'title' => $site->getTitle(), 'url' => $site->getUrl()], Response::HTTP_CREATED);
    }

    #[Route('/{siteId}', methods: ['GET'])]
    public function show(string $siteId): JsonResponse
    {
        $site = $this->sites->get($this->getAuthenticatedUser(), $siteId);
        return new JsonResponse(['id' => $site->getId(), 'title' => $site->getTitle(), 'url' => $site->getUrl()]);
    }
}
