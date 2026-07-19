<?php

namespace App\Admin\Service;

use App\Repository\UsersRepository;

class AdminStateService
{
    public function __construct(
        private readonly UsersRepository $usersRepository
    ) {
    }

    public function getAllUsers(): array
    {
        $users = $this->usersRepository->findAllUsersInformations();
        $totalOfUsers = $this->usersRepository->countUsers();

        return [
            'allUsers' => $users,
            'total' => $totalOfUsers,
        ];
    }
}
