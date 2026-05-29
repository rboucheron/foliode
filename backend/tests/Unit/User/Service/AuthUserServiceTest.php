<?php

declare(strict_types=1);

namespace App\Tests\Unit\User\Service;

use App\Entity\Users;
use App\Repository\UsersRepository;
use App\Service\InternalServerExceptionService;
use App\Service\ValidatorBaseService;
use App\User\Dto\AuthUserDto;
use App\User\Dto\CreateUsersDto;
use App\User\Service\AuthUserService;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AuthUserServiceTest extends TestCase
{
    private ValidatorBaseService&MockObject $validator;
    private InternalServerExceptionService&MockObject $internalServerExceptionService;
    private UsersRepository&MockObject $usersRepository;
    private EntityManagerInterface&MockObject $entityManager;
    private JWTTokenManagerInterface&MockObject $jwtTokenManager;
    private UserPasswordHasherInterface&MockObject $passwordHasher;

    private AuthUserService $service;

    protected function setUp(): void
    {
        $this->validator = $this->createMock(ValidatorBaseService::class);
        $this->internalServerExceptionService = $this->createMock(InternalServerExceptionService::class);
        $this->usersRepository = $this->createMock(UsersRepository::class);
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->jwtTokenManager = $this->createMock(JWTTokenManagerInterface::class);
        $this->passwordHasher = $this->createMock(UserPasswordHasherInterface::class);

        $this->service = new AuthUserService(
            $this->validator,
            $this->internalServerExceptionService,
            $this->usersRepository,
            $this->entityManager,
            $this->jwtTokenManager,
            $this->passwordHasher
        );
    }

    public function testCreateUserNormalizesEmailAndPersistsUser(): void
    {
        $dto = new CreateUsersDto();
        $dto->email = '  USER@Example.COM ';
        $dto->firstName = 'Jane';
        $dto->lastName = 'Doe';
        $dto->password = 'StrongPass123!';

        $this->validator
            ->expects($this->once())
            ->method('CatchInvalidData')
            ->with($dto);

        $this->usersRepository
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['email' => 'user@example.com'])
            ->willReturn(null);

        $this->passwordHasher
            ->expects($this->once())
            ->method('hashPassword')
            ->willReturn('hashed-password');

        $this->entityManager->expects($this->once())->method('persist');
        $this->entityManager->expects($this->once())->method('flush');

        $user = $this->service->createUser($dto);

        self::assertInstanceOf(Users::class, $user);
        self::assertSame('user@example.com', $user->getEmail());
        self::assertSame('Jane', $user->getFirstName());
        self::assertSame('Doe', $user->getLastName());
        self::assertSame('hashed-password', $user->getPassword());
    }

    public function testCreateUserThrowsConflictWhenEmailAlreadyExists(): void
    {
        $dto = new CreateUsersDto();
        $dto->email = 'existing@example.com';
        $dto->firstName = 'John';
        $dto->lastName = 'Doe';
        $dto->password = 'StrongPass123!';

        $this->validator->method('CatchInvalidData');

        $this->usersRepository
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['email' => 'existing@example.com'])
            ->willReturn(new Users());

        $this->expectException(ConflictHttpException::class);
        $this->expectExceptionMessage('User with this email already exists');

        $this->service->createUser($dto);
    }

    public function testAuthenticateUserReturnsUserForValidCredentials(): void
    {
        $dto = new AuthUserDto();
        $dto->email = '  valid@example.com ';
        $dto->password = 'pass';

        $user = (new Users())->setEmail('valid@example.com')->setPassword('hashed');

        $this->validator
            ->expects($this->once())
            ->method('CatchInvalidData')
            ->with($dto);

        $this->usersRepository
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['email' => 'valid@example.com'])
            ->willReturn($user);

        $this->passwordHasher
            ->expects($this->once())
            ->method('isPasswordValid')
            ->with($user, 'pass')
            ->willReturn(true);

        self::assertSame($user, $this->service->authenticateUser($dto));
    }

    public function testAuthenticateUserThrowsUnauthorizedWhenPasswordIsInvalid(): void
    {
        $dto = new AuthUserDto();
        $dto->email = 'user@example.com';
        $dto->password = 'bad';

        $user = new Users();

        $this->validator->method('CatchInvalidData');
        $this->usersRepository->method('findOneBy')->willReturn($user);
        $this->passwordHasher->method('isPasswordValid')->willReturn(false);

        $this->expectException(UnauthorizedHttpException::class);
        $this->expectExceptionMessage('Invalid email or password');

        $this->service->authenticateUser($dto);
    }

    public function testCreateJWTReturnsGeneratedToken(): void
    {
        $user = new Users();

        $this->jwtTokenManager
            ->expects($this->once())
            ->method('create')
            ->with($user)
            ->willReturn('jwt-token');

        self::assertSame('jwt-token', $this->service->createJWT($user));
    }

    public function testCreateJWTRaisesInternalServerExceptionWhenTokenGenerationFails(): void
    {
        $user = new Users();
        $failure = new \RuntimeException('boom');

        $this->jwtTokenManager
            ->expects($this->once())
            ->method('create')
            ->willThrowException($failure);

        $this->internalServerExceptionService
            ->expects($this->once())
            ->method('raise')
            ->with('JWT configuration error (private key/passphrase)', $failure)
            ->willThrowException(new HttpException(500, 'JWT configuration error (private key/passphrase)', $failure));

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('JWT configuration error (private key/passphrase)');

        $this->service->createJWT($user);
    }
}
