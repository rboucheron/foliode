<?php

namespace App\User\Controller;

use App\Entity\Users;
use App\Service\BaseControllerWithAuth;
use App\User\DTO\UpdateUserSettingsDTO;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
final class UserSettingsController extends BaseControllerWithAuth
{
    public function __construct(private EntityManagerInterface $em) {}

    #[Route('/api/me/settings', methods: ['GET'])]
    public function show(): JsonResponse
    {
        return new JsonResponse(['multiSiteEnabled' => $this->getAuthenticatedUser()->isMultiSiteEnabled()]);
    }

    #[Route('/api/me/settings', methods: ['PATCH'])]
    public function update(#[MapRequestPayload] UpdateUserSettingsDTO $dto): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        $user->setMultiSiteEnabled($dto->multiSiteEnabled);
        $this->em->flush();
        return new JsonResponse(['multiSiteEnabled' => $user->isMultiSiteEnabled()]);
    }
}
