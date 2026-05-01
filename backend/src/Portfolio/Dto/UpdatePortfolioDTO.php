<?php 
namespace App\Portfolio\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UpdatePortfolioDTO
{
    #[Assert\Length(max: 255, maxMessage: "title cannot exceed 255 characters")]
    public ?string $title = '';
    #[Assert\Length(max: 255, maxMessage: "subtitle cannot exceed 255 characters")]
    public ?string $subtitle = null;
    public ?string $bio = null;
    #[Assert\Length(max: 255, maxMessage: "url cannot exceed 255 characters")]
    public ?string $url = null;
}
