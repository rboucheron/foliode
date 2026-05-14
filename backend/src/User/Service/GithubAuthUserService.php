<?php

namespace App\User\Service;

use App\Entity\Users;
use App\Github\GithubApiRequester;
use App\Service\InternalServerExceptionService;
use App\Service\ApiRequesterService;
use App\Repository\UsersRepository;
use App\Service\ValidatorBaseService;
use App\User\Dto\GithubUserDto;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Flex\GithubApi;

class GithubAuthUserService
{
    private const GITHUB_USER_URL = 'https://api.github.com/user';
    private const GITHUB_API_VERSION = 'application/vnd.github.v3+json';

    public function __construct(
        private ApiRequesterService $apiRequester,
        private InternalServerExceptionService $internalServerExceptionService,
        private UsersRepository $usersRepository,
        private EntityManagerInterface $em,
        private ValidatorBaseService $validator,
        private GithubApiRequester $githubApiRequester,
    ) {
    }

    public function authenticateGithubUser(GithubUserDto $githubUserDto): Users
    {
        $this->validator->CatchInvalidData($githubUserDto);

        try {
            $userData = $this->githubApiRequester->authenticateUserFromGithub($githubUserDto);

            $user = $this->usersRepository->findOneBy(['github_id' => $userData['id']]);
            $existingUser = $this->usersRepository->findOneBy(['email' => $githubUserDto->email]);

            if ($user) {
                return $this->updateUserWithGithub($user, $userData, $githubUserDto->token);
            }

            if ($existingUser) {
                throw new UnauthorizedHttpException('Account already exists. Please log in to link your accounts.');
            }

            $user = $this->creatGithubUserFromData($userData, $githubUserDto->token);

            return $user;

        } catch (\Exception $e) {
            $this->internalServerExceptionService->raise('GithubAuthenticationFailed', $e);
        }
    }

    private function updateUserWithGithub(Users $user, array $userData, string $githubToken): Users
    {
        $user->setGithubLogin($userData['login']);
        $user->setAvatarUrl($userData['avatar_url'] ?? null);
        $user->setGithubToken($githubToken);
        $this->em->flush();

        return $user;
    }

    private function creatGithubUserFromData(array $userData, string $githubToken): Users
    {
        $user = (new Users())
            ->setLastName($userData['lastname'] ?? 'Unknown')
            ->setFirstName($userData['firstname'] ?? 'Unknown')
            ->setEmail($userData['email'] ?? 'Unknown')
            ->setIsEmailVerified(true)
            ->setGithubLogin($userData['login'])
            ->setGithubId($userData['id'])
            ->setGithubToken($githubToken)
            ->setAvatarUrl($userData['avatar_url'] ?? null);

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

}