<?php

namespace App\Admin\Controller;

use App\Admin\Service\AdminStateService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ADMIN')]
#[Route('/foliode/admin', name: 'foliode_admin_')]
class AdminDashboardController extends AbstractController
{
    public function __construct(
        private readonly AdminStateService $stateService
    ) {
    }

    #[Route('/users/dashboard', name: 'users_dashboard', methods: ['GET', 'POST'])]
    public function login(Request $request): Response
    {
        $allUsers = $this->stateService->getAllUsers();

        return $this->render('admin/users/dashboard.html.twig', [
            'users' => $allUsers,
        ]);
    }
}
