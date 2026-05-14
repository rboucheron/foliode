<?php

namespace App\User\Controller;

use App\Service\ApiRequesterService;
use App\Service\ExternalUserService;
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
        private ApiRequesterService $apiRequester,
        private ExternalUserService $externalUserService,
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

    #[Route('/v1/api/user/auth/dribbble', methods: ['POST'])]
    public function dribbbleAuth(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $dribbbleToken = $data['token'] ?? null;
        $user = $this->getUser();

        if (!$dribbbleToken) {
            return new JsonResponse(['error' => 'dribbble token is missing'], Response::HTTP_BAD_REQUEST);
        }

        $userData = $this->apiRequester->get('https://api.dribbble.com/v2/user', ['Authorization' => 'Bearer ' . $dribbbleToken]);

        if (!$userData) {
            return new JsonResponse(['error' => 'dribbble Token is invalid'], Response::HTTP_BAD_REQUEST);
        }

        if (!$user) {
            return new JsonResponse($this->externalUserService->findOrCreateUserFromDribbble($userData), Response::HTTP_OK);
        }

        return new JsonResponse($this->externalUserService->updateUserWithDribble($user, $userData), Response::HTTP_OK);
    }
}