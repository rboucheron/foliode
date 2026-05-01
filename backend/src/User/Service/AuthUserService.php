<?php

namespace App\User\Service;

use App\Entity\Users;
use App\Repository\UsersRepository;
use App\Service\InternalServerExceptionService;
use App\Service\ValidatorBaseService;
use App\User\Dto\AuthUserDto;
use App\User\Dto\CreateUsersDto;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class AuthUserService
{
    public function __construct(
        private ValidatorBaseService $validatorBaseService,
        private InternalServerExceptionService $internalServerExceptionService,
        private UsersRepository $usersRepository,
        private EntityManagerInterface $em,
        private JWTTokenManagerInterface $jwtManager,
        private UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    public function createUser(CreateUsersDto $userDto): Users
    {
        $this->validatorBaseService->CatchInvalidData($userDto);

        $existingUser = $this->findUserByEmail($userDto->email);
        if ($existingUser) {
            throw new ConflictHttpException('User with this email already exists');
        }

        $user = new Users()
            ->setEmail($this->normalizeEmail($userDto->email))
            ->setFirstName($userDto->firstName)
            ->setLastName($userDto->lastName);
        $user->setPassword($this->passwordHasher->hashPassword($user, $userDto->password));
        $this->emPersist($user);

        return $user;
    }

    public function authenticateUser(AuthUserDto $credentials): Users
    {
        $this->validatorBaseService->CatchInvalidData($credentials);

        $user = $this->findUserByEmail($this->normalizeEmail($credentials->email));

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $credentials->password)) {
            throw new UnauthorizedHttpException('', 'Invalid email or password');
        }

        return $user;
    }

    public function createJWT(Users $user): string
    {
        try {
            return $this->jwtManager->create($user);
        } catch (\Throwable $exception) {
            $this->internalServerExceptionService->raise('JWT configuration error (private key/passphrase)', $exception);
        }
    }

    private function normalizeEmail(string $email): string
    {
        return strtolower(trim($email));
    }

    private function findUserByEmail(string $email): ?Users
    {
        return $this->usersRepository->findOneBy(['email' => $this->normalizeEmail($email)]);
    }

    public function emPersist(Users $user): void
    {
        try {
            $this->em->persist($user);
            $this->em->flush();
        } catch (\Throwable $exception) {
            $this->internalServerExceptionService->raise('Database persistence error', $exception);
        }
    }
}