<?php

namespace App\Portfolio\Service;

use App\Entity\Portfolio\Portfolios;
use App\Entity\Users;
use App\Portfolio\Dto\CreatNewPortfolioDTO;
use App\Portfolio\Dto\UpdatePortfolioDTO;
use App\Repository\PortfoliosRepository;
use App\Service\ValidatorBaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class PortfolioService
{
    public function __construct(
        private PortfoliosRepository $portfoliosRepository,
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private ValidatorBaseService $validatorBaseService
    ) {
    }

    public function getPortfolioByUser(Users $user): ?Portfolios
    {
        return $this->portfoliosRepository->findOneBy(['users' => $user]);
    }

    public function getPortfolioByUniqueUrl(string $url): ?Portfolios
    {
        return $this->portfoliosRepository->findOneBy(['url' => $url]);
    }

    public function createNewPortfolio(Users $user, CreatNewPortfolioDTO $portfolioDTO): Portfolios
    {
        $this->validatorBaseService->CatchInvalidData($portfolioDTO);
        $portfolio = new Portfolios();
        $portfolio->setUsers($user);
        $portfolio->setAuthor($user->getFullName());
        $portfolio->setTitle($portfolioDTO->title);
        $portfolio->setSubtitle($portfolioDTO->subtitle);
        $portfolio->setBio($portfolioDTO->bio);
        $portfolio->setUrl($this->generateUniqueUrl($portfolioDTO->title));
        $this->emPersist($portfolio);

        return $portfolio;
    }

    public function useUserNamehasUniqueUrl(Portfolios $portfolio): string
    {
        $portfolio->setUrl(
            $this->generateUniqueUrl(
                $portfolio->getAuthor()
            )
        );
        $this->em->flush();

        return $portfolio->getUrl();
    }
  
    public function updatePortfolio(Portfolios $portfolio, UpdatePortfolioDTO $portfolioDTO)
    {
        $this->validatorBaseService->CatchInvalidData($portfolioDTO);
        $portfolio->setTitle($portfolioDTO->title ?? $portfolio->getTitle());
        $portfolio->setSubtitle($portfolioDTO->subtitle ?? $portfolio->getSubtitle());
        $portfolio->setBio($portfolioDTO->bio ?? $portfolio->getBio());
        $portfolio->setUrl($portfolioDTO->url ?? $portfolio->getUrl());
        $this->em->flush(); 

        return $portfolio;
    }

    private function generateUniqueUrl(string $title): string
    {
        $base = strtolower($title);
        $base = preg_replace('/[^a-z0-9]+/', '-', $base) ?? '';
        $base = trim($base, '-');

        if ($base === '') {
            $base = 'portfolio';
        }

        $candidate = $base;
        $index = 1;

        while ($this->getPortfolioByUniqueUrl($candidate) !== null) {
            $candidate = sprintf('%s-%d', $base, $index);
            $index++;
        }

        return $candidate;
    }

    public function emPersist(Portfolios $portfolio): void
    {
        $this->em->persist($portfolio);
        $this->em->flush();
    }

    public function updateStatus(Portfolios $porfolio, int $status): void
    {
        $porfolio->setStatus($status);
        $this->em->flush();
    }

    public function serializePortfolio(Portfolios $portfolio): string
    {
        return $this->serializer->serialize($portfolio, 'json', ['groups' => 'getPortfolio']);
    }


}