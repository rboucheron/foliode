<?php

namespace App\User\Controller;

use App\User\Dto\GithubUserDto;
use App\User\Service\AuthUserService;
use App\User\Service\GithubAuthUserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ExternalAuthController extends AbstractController
{
    public function __construct(
        private AuthUserService $authUserService,
        private SerializerInterface $serializer,
        private GithubAuthUserService $githubAuthUserService,
    ) {
    }

    #[Route('/v1/api/user/auth/github', methods: ['POST'])]
    public function githubAuth(Request $request): JsonResponse
    {
        $user = $this->githubAuthUserService->authenticateGithubUser(
            $this->serializer->deserialize(
                $request->getContent(),
                GithubUserDto::class,
                'json'
            )
        );

        return new JsonResponse(
            ['token' => $this->authUserService->createJWT($user)],
            Response::HTTP_OK
        );
    }
}