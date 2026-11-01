<?php

namespace App\Tests\Factory;

use Faker\Factory;
use Faker\Generator;

final class ProfileFactory
{
    public const PASSWORD = 'PAssword34434??';

    public static function userPayload(?string $suffix = null): array
    {
        $faker = self::faker();
        $suffix ??= $faker->unique()->bothify('??##??');

        return [
            'firstName' => 'Raphael',
            'lastName' => 'Boucheron',
            'email' => 'raphael+' . strtolower($suffix) . '@example.test',
            'password' => self::PASSWORD,
        ];
    }

    public static function portfolioPayload(?string $suffix = null): array
    {
        $suffix ??= self::faker()->unique()->numerify('###');

        return [
            'title' => 'Foliode de Raphael ' . $suffix,
            'subtitle' => 'Développeur full-stack',
            'bio' => 'Portfolio de Raphael Boucheron, alias rabouch.',
            'commentMessage' => 'Merci pour votre retour.',
        ];
    }

    public static function projectPayload(?string $suffix = null): array
    {
        $suffix ??= self::faker()->unique()->numerify('###');

        return [
            'title' => 'Projet Foliode ' . $suffix,
            'description' => 'Une expérience portfolio construite avec Symfony et TanStack Start.',
            'images' => [],
            'links' => [
                ['name' => 'GitHub', 'url' => 'https://github.com/rabouch/foliode'],
            ],
        ];
    }

    private static function faker(): Generator
    {
        return Factory::create('fr_FR');
    }
}
