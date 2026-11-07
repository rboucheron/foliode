<?php 
namespace App\Service;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\Users;

class BaseControllerWithAuth extends AbstractController
{
    /**
     * @return Users
     */
    protected function getAuthenticatedUser(): Users
    {
        $user = $this->getUser();
        if (!$user instanceof Users) {
            throw $this->createAccessDeniedException();
        }
        return $user;
    }
}