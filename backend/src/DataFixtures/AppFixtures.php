<?php

namespace App\DataFixtures;

use App\Entity\Portfolio\Portfolios;
use App\Entity\Portfolio\Projects;
use App\Entity\Users;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AppFixtures extends Fixture
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');
        $user = (new Users())
            ->setFirstName('Raphael')
            ->setLastName('Boucheron')
            ->setEmail('raphael+' . $faker->unique()->numerify('####') . '@example.test')
            ->setGithubLogin('rabouch')
            ->setPassword('temporary')
            ->setIsEmailVerified(true);
        $user->setPassword($this->passwordHasher->hashPassword($user, 'PAssword34434??'));

        $portfolio = (new Portfolios())
            ->setUsers($user)
            ->setTitle('Foliode de Raphael')
            ->setSubtitle('Développeur full-stack')
            ->setBio('Je conçois des produits web utiles, accessibles et durables.')
            ->setAuthor('Raphael Boucheron')
            ->setUrl('rbou');

        foreach (['Foliode', 'Portfolio étudiant'] as $title) {
            $project = (new Projects())
                ->setTitle($title . ' ' . $faker->unique()->numerify('##'))
                ->setDescription($faker->sentence(12))
                ->setUser($user)
                ->setPortfolio($portfolio);
            $manager->persist($project);
        }

        $manager->persist($user);
        $manager->persist($portfolio);
        $manager->flush();
    }
}
