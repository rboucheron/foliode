<?php

namespace App\Entity\Portfolio;

use App\Entity\Users;
use App\Repository\PortfolioCommentsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PortfolioCommentsRepository::class)]
#[ORM\Table(name: 'tbl_portfolio_comment')]
class PortfolioComment
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    #[Groups('getPortfolioComment')]
    private ?string $id = null;

    #[ORM\ManyToOne(targetEntity: Portfolios::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Portfolios $portfolio = null;

    #[ORM\ManyToOne(targetEntity: Users::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?Users $user = null;

    #[ORM\ManyToOne(targetEntity: PortfolioVisitor::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?PortfolioVisitor $visitor = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups('getPortfolioComment')]
    private ?string $message = null;

    #[ORM\Column(type: Types::INTEGER)]
    #[Groups('getPortfolioComment')]
    private ?int $status = PortfolioCommentStatus::VISIBLE;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups('getPortfolioComment')]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups('getPortfolioComment')]
    private ?\DateTimeInterface $hiddenAt = null;

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

    public function getUser(): ?Users
    {
        return $this->user;
    }

    public function setUser(?Users $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getVisitor(): ?PortfolioVisitor
    {
        return $this->visitor;
    }

    public function setVisitor(?PortfolioVisitor $visitor): static
    {
        $this->visitor = $visitor;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getHiddenAt(): ?\DateTimeInterface
    {
        return $this->hiddenAt;
    }

    public function setHiddenAt(?\DateTimeInterface $hiddenAt): static
    {
        $this->hiddenAt = $hiddenAt;

        return $this;
    }

    #[Groups('getPortfolioComment')]
    public function getAuthorFirstname(): ?string
    {
        return $this->user?->getFirstName() ?? $this->visitor?->getFirstname();
    }

    #[Groups('getPortfolioComment')]
    public function getAuthorLastname(): ?string
    {
        return $this->user?->getLastName() ?? $this->visitor?->getLastname();
    }

    #[Groups('getPortfolioComment')]
    public function getAuthorAvatarUrl(): ?string
    {
        return $this->user?->getAvatarUrl() ?? $this->visitor?->getAvatarUrl();
    }

    #[Groups('getPortfolioComment')]
    public function getAuthorEmail(): ?string
    {
        return $this->user?->getEmail();
    }
}