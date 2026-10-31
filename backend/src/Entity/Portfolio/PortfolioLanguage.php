<?php

namespace App\Entity\Portfolio;

use App\Repository\PortfolioLanguageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;

#[ORM\Entity(repositoryClass: PortfolioLanguageRepository::class)]
#[ORM\Table(name: "tbl_portfolio_language")]
#[ORM\UniqueConstraint(name: "uniq_portfolio_language_code", columns: ["portfolio_id", "code"])]
class PortfolioLanguage
{
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?string $id = null;

    #[ORM\ManyToOne(inversedBy: 'portfolioLanguages')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Portfolios $portfolio = null;

    #[ORM\Column(length: 64)]
    private ?string $code = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $label = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $isSource = false;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getPortfolio(): ?Portfolios
    {
        return $this->portfolio;
    }

    public function setPortfolio(?Portfolios $portfolio): static
    {
        $this->portfolio = $portfolio;

        return $this;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(?string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function isSource(): bool
    {
        return $this->isSource;
    }

    public function setIsSource(bool $isSource): static
    {
        $this->isSource = $isSource;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function toArray(): array
    {
        return ['code' => $this->code, 'label' => $this->label];
    }
}
