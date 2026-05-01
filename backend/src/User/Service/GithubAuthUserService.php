<?php

namespace App\User\Service;

use App\Entity\Users;
use App\Service\InternalServerExceptionService;
use App\Service\ApiRequesterService;
use App\Repository\UsersRepository;
use App\Service\ValidatorBaseService;
use App\User\Dto\GithubUserDto;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class GithubAuthUserService
{
    public function __construct(
        private ApiRequesterService $apiRequester,
        private InternalServerExceptionService $internalServerExceptionService,
        private UsersRepository $usersRepository,
        private EntityManagerInterface $em,
        private ValidatorBaseService $validator,
    ) {
    }

    public function authenticateGithubUser(GithubUserDto $githubUserDto): Users
    {
        $this->validator->CatchInvalidData($githubUserDto);
        
        try {
            $userDate = $this->authenticateUserFromGithub($githubUserDto);

            return $this->findOrCreateUserFromGithub($userDate, $githubUserDto->email);

        } catch (\Exception $e) {
            $this->internalServerExceptionService->raise('GithubAuthenticationFailed', $e);
        }
    }

    private function authenticateUserFromGithub(GithubUserDto $user): array
    {
        $userData = $this->apiRequester->get(
            'https://api.github.com/user',
            ['Authorization' => 'Bearer ' . $user->token, 'Accept' => 'application/vnd.github.v3+json',]
        );

        if (!$userData) {
            throw new UnauthorizedHttpException('', 'Github Token is invalid');
        }

        return $userData;
    }

    private function findOrCreateUserFromGithub(array $userData, string $email): Users
    {
        $user = $this->usersRepository->findOneBy(['github_id' => $userData['id']]);
        $existingUser = $this->usersRepository->findOneBy(['email' => $email]);

        if ($user) {
            return $user;
        }

        if ($existingUser) {
            throw new UnauthorizedHttpException('Account already exists. Please log in to link your accounts.');
        }

        $user = (new Users())
            ->setLastName($userData['lastname'] ?? 'Unknown')
            ->setFirstName($userData['firstname'] ?? 'Unknown')
            ->setEmail($userData['email'] ?? $email)
            ->setIsEmailVerified(true)
            ->setGithubLogin($userData['login'])
            ->setGithubId($userData['id'])
            ->setAvatarUrl($userData['avatar_url'] ?? null);

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}