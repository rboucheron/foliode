<?php

namespace App\Entity;

use App\Entity\Portfolio\Portfolios;
use App\Entity\Portfolio\Projects;
use App\Repository\UsersRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Ramsey\Uuid\Doctrine\UuidGenerator;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UsersRepository::class)]
#[ORM\Table(name: "tbl_user")]
class Users implements PasswordAuthenticatedUserInterface, UserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?string $id = null; // @phpstan-ignore property.unusedType (Doctrine generates this identifier during persistence)

    #[ORM\Column(length: 255)]
    #[Groups(['getUsers', 'getPortfolio'])]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['getUsers', 'getPortfolio'])]
    private ?string $firstname = null;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    #[Groups(['getUsers', 'getPortfolio', 'getPromotion'])]
    private ?string $email = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $password = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $github_token = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('getUsers')]
    private ?string $github_login = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups('getUsers')]
    private ?string $github_id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('getUsers')]
    private ?string $dribbble_login = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups('getUsers')]
    private ?string $dribbble_id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['getUsers', 'getPortfolio', 'getPromotion'])]
    private ?string $avatar_url = null;

    /** @var list<string> */
    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\Column(type: 'string', length: 6, nullable: true)]
    private ?string $email_verification_code = null;

    #[ORM\Column]
    #[Groups('getUsers')]
    private bool $is_email_verified = false;

    #[ORM\Column(options: ['default' => false])]
    #[Groups(['getUsers'])]
    private bool $multiSiteEnabled = false;

    /** @var Collection<int, Portfolios> */
    #[ORM\OneToMany(mappedBy: 'users', targetEntity: Portfolios::class, cascade: ['persist', 'remove'])]
    private Collection $portfolios;

    /**
     * @var Collection<int, Projects>
     */
    #[ORM\OneToMany(targetEntity: Projects::class, mappedBy: 'user')]
    private Collection $projects;

    public function __construct()
    {
        $this->projects = new ArrayCollection();
        $this->portfolios = new ArrayCollection();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getGithubToken(): ?string
    {
        return $this->github_token;
    }

    public function setGithubToken(?string $github_token): self
    {
        $this->github_token = $github_token;
        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastname;
    }

    public function setLastName(string $lastname): static
    {
        $this->lastname = $lastname;
        return $this;
    }

    public function getFullName(): string
    {
        return trim(($this->firstname ?? '') . ' ' . ($this->lastname ?? ''));
    }

    public function getFirstName(): ?string
    {
        return $this->firstname;
    }

    public function setFirstName(string $firstname): static
    {
        $this->firstname = $firstname;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getGithubLogin(): ?string
    {
        return $this->github_login;
    }

    public function setGithubLogin(?string $github_login): static
    {
        $this->github_login = $github_login;

        return $this;
    }

    public function getGithubId(): string
    {
        return $this->github_id;
    }

    public function setGithubId(?string $githubId): self
    {
        $this->github_id = $githubId;
        return $this;
    }

    public function getDribbbleLogin(): ?string
    {
        return $this->dribbble_login;
    }

    public function setDribbbleLogin(?string $dribbbleLogin): self
    {
        $this->dribbble_login= $dribbbleLogin;
        return $this;
    }

    public function getDribbbleId(): ?string
    {
        return $this->dribbble_id;
    }

    public function setDribbbleId(?string $dribbbleId): self
    {
        $this->dribbble_id = $dribbbleId;
        return $this;
    }


    public function getAvatarUrl(): ?string
    {
        return $this->avatar_url;
    }

    public function setAvatarUrl(?string $avatar_url): static
    {
        $this->avatar_url = $avatar_url;

        return $this;
    }

    /** @return list<string> */
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_values(array_unique($roles));
    }

    /** @param list<string> $roles */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    public function getEmailVerificationCode(): string
    {
        return $this->email_verification_code;
    }

    public function setEmailVerificationCode(?string $emailVerificationCode): self
    {
        $this->email_verification_code = $emailVerificationCode;
        return $this;
    }

    public function getIsEmailVerified(): bool
    {
        return $this->is_email_verified;
    }

    public function setIsEmailVerified(bool $isEmailVerified): self
    {
        $this->is_email_verified = $isEmailVerified;
        return $this;
    }

    public function getSalt(): ?string
    {
        return null;
    }

    public function eraseCredentials(): void
    {
        // $this->password = null;
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    /** @return Collection<int, Projects> */
    public function getProjects(): Collection
    {
        return $this->projects;
    }

    public function isMultiSiteEnabled(): bool
    {
        return $this->multiSiteEnabled;
    }

    public function setMultiSiteEnabled(bool $enabled): self
    {
        $this->multiSiteEnabled = $enabled;
        return $this;
    }

    /** @return Collection<int, Portfolios> */
    public function getPortfolios(): Collection
    {
        return $this->portfolios;
    }

    public function addPortfolio(Portfolios $portfolio): self
    {
        if (!$this->portfolios->contains($portfolio)) {
            $this->portfolios->add($portfolio);
            $portfolio->setUsers($this);
        }
        return $this;
    }

    public function removePortfolio(Portfolios $portfolio): self
    {
        $this->portfolios->removeElement($portfolio);
        return $this;
    }

    /** Backward-compatible accessor for the primary portfolio. */
    public function getPortfolio(): ?Portfolios
    {
        return $this->portfolios->first() ?: null;
    }

    public function setPortfolio(?Portfolios $portfolio): self
    {
        if ($portfolio !== null) {
            $this->addPortfolio($portfolio);
        }
        return $this;
    }


}