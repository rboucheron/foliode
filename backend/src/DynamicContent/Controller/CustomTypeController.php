<?php

namespace App\DynamicContent\Controller;

use App\DynamicContent\DTO\SaveCustomEntryDTO;
use App\DynamicContent\DTO\SaveCustomTypeDTO;
use App\DynamicContent\Entity\CustomEntry;
use App\DynamicContent\Entity\CustomType;
use App\DynamicContent\Service\DynamicContentService;
use App\Service\BaseControllerWithAuth;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
#[Route('/v1/api/sites/{siteId}/custom-types')]
final class CustomTypeController extends BaseControllerWithAuth
{
    public function __construct(private DynamicContentService $content) {}

    #[Route('', methods: ['GET'])]
    public function index(string $siteId): JsonResponse
    {
        return new JsonResponse(array_map($this->typeData(...), $this->content->listTypes($this->getAuthenticatedUser(), $siteId)));
    }

    #[Route('', methods: ['POST'])]
    public function create(string $siteId, #[MapRequestPayload] SaveCustomTypeDTO $dto): JsonResponse
    {
        return new JsonResponse($this->typeData($this->content->saveType($this->getAuthenticatedUser(), $siteId, $dto)), Response::HTTP_CREATED);
    }

    #[Route('/{typeId}', methods: ['PUT'])]
    public function update(string $siteId, string $typeId, #[MapRequestPayload] SaveCustomTypeDTO $dto): JsonResponse
    {
        return new JsonResponse($this->typeData($this->content->saveType($this->getAuthenticatedUser(), $siteId, $dto, $typeId)));
    }

    #[Route('/{typeId}', methods: ['DELETE'])]
    public function delete(string $siteId, string $typeId): JsonResponse
    {
        $this->content->deleteType($this->getAuthenticatedUser(), $siteId, $typeId);
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/{typeId}/entries', methods: ['GET'])]
    public function entries(string $siteId, string $typeId): JsonResponse
    {
        return new JsonResponse(array_map($this->entryData(...), $this->content->listEntries($this->getAuthenticatedUser(), $siteId, $typeId)));
    }

    #[Route('/{typeId}/entries', methods: ['POST'])]
    public function createEntry(string $siteId, string $typeId, #[MapRequestPayload] SaveCustomEntryDTO $dto): JsonResponse
    {
        return new JsonResponse($this->entryData($this->content->saveEntry($this->getAuthenticatedUser(), $siteId, $typeId, $dto)), Response::HTTP_CREATED);
    }

    #[Route('/{typeId}/entries/{entryId}', methods: ['PUT'])]
    public function updateEntry(string $siteId, string $typeId, string $entryId, #[MapRequestPayload] SaveCustomEntryDTO $dto): JsonResponse
    {
        return new JsonResponse($this->entryData($this->content->saveEntry($this->getAuthenticatedUser(), $siteId, $typeId, $dto, $entryId)));
    }

    #[Route('/{typeId}/entries/{entryId}', methods: ['DELETE'])]
    public function deleteEntry(string $siteId, string $typeId, string $entryId): JsonResponse
    {
        $this->content->deleteEntry($this->getAuthenticatedUser(), $siteId, $typeId, $entryId);
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    private function typeData(CustomType $type): array
    {
        return ['id' => $type->getId(), 'name' => $type->getName(), 'layout' => $type->getLayout(), 'fields' => $type->getFields()];
    }

    private function entryData(CustomEntry $entry): array
    {
        return ['id' => $entry->getId(), 'values' => $entry->getValues(), 'createdAt' => $entry->getCreatedAt()->format(DATE_ATOM)];
    }
}
