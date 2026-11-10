<?php

namespace App\Controller;

use App\Service\FileUploaderService;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Users;
use Symfony\Component\Serializer\SerializerInterface;

class UserController extends AbstractController
{

    public function __construct(
        private EntityManagerInterface $entityManager,
        private JWTTokenManagerInterface $jwtManager,
        private SerializerInterface $serializer,
        private FileUploaderService $fileUploader
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/api/user', name: 'update_user', methods: ['PUT'])]
    public function update_user(
        Request $req
    ): JsonResponse {
        $user = $this->getUser();
        $data = $req->getContent();

        $this->serializer->deserialize($data, Users::class, 'json', ['object_to_populate' => $user]);


        $this->entityManager->flush();
        $token = $this->jwtManager->create($user);
        return new JsonResponse(['message' => 'User updated successfully', 'token' => $token], Response::HTTP_OK);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/api/user/profil', methods: ['POST'])]
    public function change_profil_picture(
        Request $request
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user instanceof Users) {
            throw $this->createAccessDeniedException();
        }
        $files = $request->files->get('image');
        $uploadDir = $this->getParameter('upload_directory') . '/avatar';


        if (!$files instanceof \\Symfony\\Component\\HttpFoundation\\File\\UploadedFile) {
            return new JsonResponse(['error' => 'An image is required.'], Response::HTTP_BAD_REQUEST);
        }

        $profilPicture = $this->fileUploader->uploadFile($files, $uploadDir);

        $user->setAvatarUrl($profilPicture);
        $this->entityManager->flush();


        $token = $this->jwtManager->create($user);
        return new JsonResponse(['message' => 'User updated successfully', 'token' => $token], Response::HTTP_OK);
    }


}