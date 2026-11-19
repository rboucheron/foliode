<?php

namespace App\DynamicContent\Entity;

use App\Entity\Portfolio\Portfolios;
use App\DynamicContent\Repository\CustomTypeRepository;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;

#[ORM\Entity(repositoryClass: CustomTypeRepository::class)]
#[ORM\Table(name: 'custom_type')]
class CustomType
{
    #[ORM\Id, ORM\Column(type: 'uuid', unique: true), ORM\GeneratedValue(strategy: 'CUSTOM'), ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?string $id = null;

    #[ORM\ManyToOne(targetEntity: Portfolios::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Portfolios $site;

    #[ORM\Column(length: 120)]
    private string $name;

    #[ORM\Column(length: 10)]
    private string $layout = 'list';

    /** @var list<array{key:string,label:string,type:string,visible:bool,order:int}> */
    #[ORM\Column(type: 'json')]
    private array $fields = [];

    public function getId(): ?string { return $this->id; }
    public function getSite(): Portfolios { return $this->site; }
    public function setSite(Portfolios $site): self { $this->site = $site; return $this; }
    public function getName(): string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }
    public function getLayout(): string { return $this->layout; }
    public function setLayout(string $layout): self { $this->layout = $layout; return $this; }
    /** @return list<array{key:string,label:string,type:string,visible:bool,order:int}> */
    public function getFields(): array { return $this->fields; }
    /** @param list<array{key:string,label:string,type:string,visible:bool,order:int}> $fields */
    public function setFields(array $fields): self { $this->fields = $fields; return $this; }
}
