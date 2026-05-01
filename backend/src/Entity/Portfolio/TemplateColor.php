<?php

namespace App\Entity\Portfolio;

class TemplateColor
{
    private string $primary = '#000000';
    private string $secondary = '#ffffff';
    private string $warning = '#ffff00';
    private string $success = '#00ff00';
    private string $info = '#00ff00';
    private string $light = '#ffff00';
    private string $dark = '#000000';



    public function setPrimary(string $primary): self
    {
        $this->primary = $primary;

        return $this;
    }

    public function setSecondary(string $secondary): self
    {
        $this->secondary = $secondary;

        return $this;
    }

    public function setWarning(string $warning): self
    {
        $this->warning = $warning;

        return $this;
    }

    public function setSuccess(string $success): self
    {
        $this->success = $success;

        return $this;
    }

    public function setInfo(string $info): self
    {
        $this->info = $info;

        return $this;
    }

    public function setLight(string $light): self
    {
        $this->light = $light;

        return $this;
    }

    public function setDark(string $dark): self
    {
        $this->dark = $dark;

        return $this;
    }

    public function getTemplateColor(): array
    {
        return [
            'primary' => $this->primary,
            'secondary' => $this->secondary,
            'warning' => $this->warning,
            'success' => $this->success,
            'info' => $this->info,
            'light' => $this->light,
            'dark' => $this->dark,
        ];
    }

}