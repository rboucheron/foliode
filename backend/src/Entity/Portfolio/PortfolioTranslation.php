<?php

namespace App\Entity\Portfolio;

use App\Repository\PortfolioTranslationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;

#[ORM\Entity(repositoryClass: PortfolioTranslationRepository::class)]
#[ORM\Table(name: "tbl_portfolio_translation")]
#[ORM\UniqueConstraint(name: "uniq_portfolio_translation_language", columns: ["portfolio_id", "language"])]
class PortfolioTranslation
{
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?string $id = null;

    #[ORM\ManyToOne(inversedBy: 'portfolioTranslations')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Portfolios $portfolio = null;

    #[ORM\Column(length: 64)]
    private ?string $language = null;

    #[ORM\Column(length: 255)]
    private string $title = '';

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $subtitle = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $bio = null;

    #[ORM\Column(length: 64)]
    private string $sourceHash = '';

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->updatedAt = new \DateTimeImmutable();
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

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(string $language): static
    {
        $this->language = $language;

        return $this;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getSubtitle(): ?string
    {
        return $this->subtitle;
    }

    public function setSubtitle(?string $subtitle): static
    {
        $this->subtitle = $subtitle;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }

    public function getSourceHash(): string
    {
        return $this->sourceHash;
    }

    public function setSourceHash(string $sourceHash): static
    {
        $this->sourceHash = $sourceHash;

        return $this;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function toContent(): array
    {
        return ['title' => $this->title, 'subtitle' => $this->subtitle, 'bio' => $this->bio];
    }
}
