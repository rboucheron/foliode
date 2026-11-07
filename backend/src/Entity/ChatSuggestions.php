<?php

namespace App\Entity;

use App\Repository\ChatSuggestionsRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Column;
use Symfony\Component\Serializer\Attribute\Groups;
use App\Entity\Portfolio\ChatSuggestionContextType;

#[ORM\Entity(repositoryClass: ChatSuggestionsRepository::class)]
class ChatSuggestions
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['chat_suggestions'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['chat_suggestions'])]
    private ?string $translation_key = null;

    #[ORM\Column]
    private ?bool $is_active = null;

    #[ORM\Column(length: 255)]
    #[Groups(['chat_suggestions'])]
    private ?string  $context_type = ChatSuggestionContextType::CONTEXT_GENERAL; 

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setContextType(string $context_type): static
    {
        $this->context_type = $context_type;

        return $this;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getTranslationKey(): ?string
    {
        return $this->translation_key;
    }

    public function setTranslationKey(string $translation_key): static
    {
        $this->translation_key = $translation_key;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->is_active;
    }

    public function setIsActive(bool $is_active): static
    {
        $this->is_active = $is_active;

        return $this;
    }
}
