<?php

namespace App\DynamicContent\Repository;

use App\DynamicContent\Entity\CustomType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<CustomType> */
class CustomTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, CustomType::class); }
}
