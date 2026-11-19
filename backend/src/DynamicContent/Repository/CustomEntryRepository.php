<?php

namespace App\DynamicContent\Repository;

use App\DynamicContent\Entity\CustomEntry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<CustomEntry> */
class CustomEntryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, CustomEntry::class); }
}
