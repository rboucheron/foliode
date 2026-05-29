<?php

declare(strict_types=1);

namespace App\Tests\Unit\Portfolio\Service;

use App\Entity\Portfolio\Portfolios;
use App\Entity\Users;
use App\Portfolio\Dto\CreatNewPortfolioDTO;
use App\Portfolio\Dto\UpdatePortfolioDTO;
use App\Portfolio\Service\PortfolioService;
use App\Repository\PortfoliosRepository;
use App\Service\ValidatorBaseService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\SerializerInterface;

final class PortfolioServiceTest extends TestCase
{
    private PortfoliosRepository&MockObject $portfoliosRepository;
    private EntityManagerInterface&MockObject $entityManager;
    private SerializerInterface&MockObject $serializer;
    private ValidatorBaseService&MockObject $validator;

    private PortfolioService $service;

    protected function setUp(): void
    {
        $this->portfoliosRepository = $this->createMock(PortfoliosRepository::class);
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->serializer = $this->createMock(SerializerInterface::class);
        $this->validator = $this->createMock(ValidatorBaseService::class);

        $this->service = new PortfolioService(
            $this->portfoliosRepository,
            $this->entityManager,
            $this->serializer,
            $this->validator
        );
    }

    public function testGetPortfolioByUserThrowsWhenPortfolioDoesNotExist(): void
    {
        $user = new Users();

        $this->portfoliosRepository
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['users' => $user])
            ->willReturn(null);

        $this->expectException(NotFoundHttpException::class);
        $this->expectExceptionMessage('Portfolio not found.');

        $this->service->getPortfolioByUser($user);
    }

    public function testGetPortfolioByUniqueUrlThrowsWhenPortfolioDoesNotExist(): void
    {
        $this->portfoliosRepository
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['url' => 'missing-url'])
            ->willReturn(null);

        $this->expectException(NotFoundHttpException::class);
        $this->expectExceptionMessage('Portfolio not found for this url.');

        $this->service->getPortfolioByUniqueUrl('missing-url');
    }

    public function testCreateNewPortfolioGeneratesIncrementedUniqueUrlOnCollision(): void
    {
        $user = (new Users())->setFirstName('Jane')->setLastName('Doe');
        $dto = new CreatNewPortfolioDTO();
        $dto->title = 'My Portfolio';
        $dto->subtitle = 'Subtitle';
        $dto->bio = 'Bio';

        $this->validator
            ->expects($this->once())
            ->method('CatchInvalidData')
            ->with($dto);

        $this->portfoliosRepository
            ->expects($this->exactly(2))
            ->method('findOneBy')
            ->withConsecutive(
                [['url' => 'my-portfolio']],
                [['url' => 'my-portfolio-1']]
            )
            ->willReturnOnConsecutiveCalls(new Portfolios(), null);

        $this->entityManager->expects($this->once())->method('persist');
        $this->entityManager->expects($this->once())->method('flush');

        $portfolio = $this->service->createNewPortfolio($user, $dto);

        self::assertSame($user, $portfolio->getUsers());
        self::assertSame('Jane Doe', $portfolio->getAuthor());
        self::assertSame('My Portfolio', $portfolio->getTitle());
        self::assertSame('Subtitle', $portfolio->getSubtitle());
        self::assertSame('Bio', $portfolio->getBio());
        self::assertSame('my-portfolio-1', $portfolio->getUrl());
    }

    public function testCreateNewPortfolioFallsBackToPortfolioSlugForEmptySanitizedTitle(): void
    {
        $user = (new Users())->setFirstName('John')->setLastName('Smith');
        $dto = new CreatNewPortfolioDTO();
        $dto->title = '!!!';

        $this->validator->expects($this->once())->method('CatchInvalidData')->with($dto);

        $this->portfoliosRepository
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['url' => 'portfolio'])
            ->willReturn(null);

        $this->entityManager->expects($this->once())->method('persist');
        $this->entityManager->expects($this->once())->method('flush');

        $portfolio = $this->service->createNewPortfolio($user, $dto);

        self::assertSame('portfolio', $portfolio->getUrl());
    }

    public function testUseUserNameHasUniqueUrlUsesAuthorAndFlushes(): void
    {
        $portfolio = (new Portfolios())->setAuthor('Jane Doe');

        $this->portfoliosRepository
            ->expects($this->exactly(2))
            ->method('findOneBy')
            ->withConsecutive(
                [['url' => 'jane-doe']],
                [['url' => 'jane-doe-1']]
            )
            ->willReturnOnConsecutiveCalls(new Portfolios(), null);

        $this->entityManager->expects($this->once())->method('flush');

        $url = $this->service->useUserNamehasUniqueUrl($portfolio);

        self::assertSame('jane-doe-1', $url);
        self::assertSame('jane-doe-1', $portfolio->getUrl());
    }

    public function testUpdatePortfolioKeepsExistingValuesWhenDtoFieldsAreNull(): void
    {
        $portfolio = (new Portfolios())
            ->setTitle('Current Title')
            ->setSubtitle('Current Subtitle')
            ->setBio('Current Bio')
            ->setUrl('current-url');

        $dto = new UpdatePortfolioDTO();
        $dto->title = null;
        $dto->subtitle = 'New Subtitle';

        $this->validator
            ->expects($this->once())
            ->method('CatchInvalidData')
            ->with($dto);

        $this->entityManager->expects($this->once())->method('flush');

        $updated = $this->service->updatePortfolio($portfolio, $dto);

        self::assertSame('Current Title', $updated->getTitle());
        self::assertSame('New Subtitle', $updated->getSubtitle());
        self::assertSame('Current Bio', $updated->getBio());
        self::assertSame('current-url', $updated->getUrl());
    }

    public function testDeletePortfolioRemovesPortfolioForUser(): void
    {
        $user = new Users();
        $portfolio = new Portfolios();

        $this->portfoliosRepository
            ->expects($this->once())
            ->method('findOneBy')
            ->with(['users' => $user])
            ->willReturn($portfolio);

        $this->entityManager
            ->expects($this->once())
            ->method('remove')
            ->with($portfolio);

        $this->entityManager->expects($this->once())->method('flush');

        $this->service->deletePortfolio($user);
    }

    public function testSerializePortfolioUsesExpectedSerializationGroup(): void
    {
        $portfolio = new Portfolios();

        $this->serializer
            ->expects($this->once())
            ->method('serialize')
            ->with($portfolio, 'json', ['groups' => 'getPortfolio'])
            ->willReturn('{"ok":true}');

        self::assertSame('{"ok":true}', $this->service->serializePortfolio($portfolio));
    }
}
