<?php

namespace App\Admin\Controller;

use App\Admin\Form\Type\LoginFormType;
use App\Admin\Service\AdminAuthService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/foliode/admin', name: 'foliode_admin_auth_')]
class AdminAuthController extends AbstractController
{
    public function __construct(
        private readonly AdminAuthService $authService
    ) {
    }

    #[Route('/auth/email/signin', name: 'login', methods: ['GET', 'POST'])]
    public function login(Request $request): Response
    {
        $form = $this->createForm(LoginFormType::class);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = $this->authService->authenticateUser($form->getData());

            // Exemple après authentification
            // $this->addFlash('success', 'Connexion réussie');

            return $this->redirectToRoute('foliode_admin_dashboard');
        }

        return $this->render('admin/auth/login.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
