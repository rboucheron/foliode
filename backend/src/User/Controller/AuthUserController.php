<?php

namespace App\User\Controller;

use App\Service\MailerService;
use App\User\Dto\AuthUserDto;
use App\User\Dto\createUsersDto;
use App\User\Service\AuthUserService;
use App\User\Service\UserEmailVerificationCodeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

class AuthUserController extends AbstractController
{
    public function __construct(
        private MailerService $mailerService,
        private SerializerInterface $serializer,
        private AuthUserService $authUserService,
        private UserEmailVerificationCodeService $userEmailVerificationCodeService,
    ) {
    }

    #[Route('/v1/api/user/auth/email/signup', methods: ['POST'])]
    public function signup(Request $request): JsonResponse
    {
        $newUser = $this->authUserService->createUser(
            $this->serializer->deserialize(
                $request->getContent(),
                createUsersDto::class,
                'json'
            )
        );

        $this->userEmailVerificationCodeService->sendWelcomeEmail($newUser);

        return new JsonResponse(
            ['token' => $this->authUserService->createJWT($newUser)],
            Response::HTTP_CREATED
        );
    }

    #[Route('/v1/api/user/auth/email/signin', methods: ['POST'])]
    public function signin(Request $request): JsonResponse
    {
        $user = $this->authUserService->authenticateUser(
            $this->serializer->deserialize(
                $request->getContent(),
                AuthUserDto::class,
                'json'
            )
        );

        return new JsonResponse(
            ['token' => $this->authUserService->createJWT($user)],
            Response::HTTP_CREATED
        );
    }
}
