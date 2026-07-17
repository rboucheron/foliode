<?php

namespace App\Admin\Command;

use App\Entity\Users;
use App\Entity\UserRoles;
use App\Repository\UsersRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Create user',
)]
class CreateAdminCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UsersRepository $usersRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = 'admin@admin.fr';

        $existingUser = $this->usersRepository->findOneBy([
            'email' => $email,
        ]);

        if ($existingUser) {
            $output->writeln('<error>L\'user already existe.</error>');
            return Command::FAILURE;
        }

        $adminPassword = random_int(100000, 999999);

        $user = new Users();

        $user
            ->setEmail($email)
            ->setFirstName('Admin')
            ->setLastName('Admin')
            ->setRoles([
                UserRoles::ADMIN,
            ])
            ->setAdminPassword((string) $adminPassword);

        $user->setPassword(
            $this->passwordHasher->hashPassword(
                $user,
                'Admin123!'
            )
        );

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $output->writeln('<info>admin user create with success.</info>');
        $output->writeln('');
        $output->writeln("Email : {$email}");
        $output->writeln("Mot de passe Symfony : Admin123!");
        $output->writeln("Code admin : {$adminPassword}");

        return Command::SUCCESS;
    }
}
