<?php 
namespace App\Portfolio\Dto;

class TemplateColorConfigDTO    
{
    public string $primary;
    public string $secondary;
    public string $warning;
    public string $success;
    public string $info;
    public string $light;
    public string $dark;

    public function __construct(
        string $primary,
        string $secondary,
        string $warning,
        string $success,
        string $info,
        string $light,
        string $dark
    ) {
        $this->primary = $primary;
        $this->secondary = $secondary;
        $this->warning = $warning;
        $this->success = $success;
        $this->info = $info;
        $this->light = $light;
        $this->dark = $dark;
    }

}