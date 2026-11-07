<?php

namespace App\User\Controller;

use App\User\Dto\UpdateUserAvatarDto;
use App\User\Dto\UpdateUserProfileDto;
use App\User\Service\UserProfileService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use App\Service\BaseControllerWithAuth;

class UserProfileController extends BaseControllerWithAuth
{
    public function __construct(
        private SerializerInterface $serializer,
        private UserProfileService $userProfileService,
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/users/profile', methods: ['PUT'])]
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser();

        $token = $this->userProfileService->updateProfile(
            $user,
            $this->serializer->deserialize($request->getContent(), UpdateUserProfileDto::class, 'json')
        );

        return new JsonResponse(['message' => 'User updated successfully', 'token' => $token], Response::HTTP_OK);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/users/avatar', methods: ['PUT'])]
    public function updateAvatar(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser();

        $token = $this->userProfileService->updateAvatar(
            $user,
            $this->serializer->deserialize($request->getContent(), UpdateUserAvatarDto::class, 'json')
        );

        return new JsonResponse(['message' => 'User updated successfully', 'token' => $token], Response::HTTP_OK);
    }
}
