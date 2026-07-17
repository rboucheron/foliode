<?php

namespace App\Admin\Service;

use App\Entity\Users;
use App\Entity\UserRoles;
use App\Repository\UsersRepository;
use App\Service\InternalServerExceptionService;
use App\Service\ValidatorBaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class AdminAuthService {

    public function __construct(
        private ValidatorBaseService $validatorBaseService,
        private InternalServerExceptionService $internalServerExceptionService,
        private UsersRepository $usersRepository,
        private EntityManagerInterface $em,
        private JWTTokenManagerInterface $jwtManager,
        private UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    public function authenticateUser(array $credentials): Users
    {
        $user = $this->findUserByEmail($this->normalizeEmail($credentials->email));

        if (
            !$user
            || !$this->passwordHasher->isPasswordValid($user, $credentials->password)
            || $user->getAdminPassword() !== $credentials->security_code
            || !in_array(UserRoles::ADMIN, $user->getRoles(), true)
        ) {
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


}
