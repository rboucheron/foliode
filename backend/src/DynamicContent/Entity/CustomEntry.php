<?php

namespace App\DynamicContent\Entity;

use App\DynamicContent\Repository\CustomEntryRepository;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;

#[ORM\Entity(repositoryClass: CustomEntryRepository::class)]
#[ORM\Table(name: 'custom_entry')]
class CustomEntry
{
    #[ORM\Id, ORM\Column(type: 'uuid', unique: true), ORM\GeneratedValue(strategy: 'CUSTOM'), ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?string $id = null;

    #[ORM\ManyToOne(targetEntity: CustomType::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private CustomType $customType;

    /** @var array<string, scalar|null> */
    #[ORM\Column(type: 'json')]
    private array $values = [];

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct() { $this->createdAt = new \DateTimeImmutable(); }
    public function getId(): ?string { return $this->id; }
    public function getCustomType(): CustomType { return $this->customType; }
    public function setCustomType(CustomType $type): self { $this->customType = $type; return $this; }
    /** @return array<string, scalar|null> */
    public function getValues(): array { return $this->values; }
    /** @param array<string, scalar|null> $values */
    public function setValues(array $values): self { $this->values = $values; return $this; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
