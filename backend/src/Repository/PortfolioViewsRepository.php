<?php

namespace App\Repository;

use App\Entity\Portfolio\PortfolioViews;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PortfolioViews>
 */
class PortfolioViewsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PortfolioViews::class);
    }

    public function getViewsLast7DaysForPortfolio(string $portfolioId): array
    {
        return $this->createQueryBuilder('pv')
            ->select('COUNT(pv.id) AS count, DATE(pv.date) AS day')
            ->andWhere('IDENTITY(pv.portfolio) = :portfolioId')
            ->andWhere('pv.date >= :date')
            ->setParameter('portfolioId', $portfolioId)
            ->setParameter('date', new \DateTimeImmutable('-7 days'))
            ->groupBy('day')
            ->orderBy('day', 'ASC')
            ->getQuery()
            ->getArrayResult();
    }
}
