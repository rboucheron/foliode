<?php

namespace App\User\Service;

use App\Entity\Users;
use App\Service\FileUploaderService;
use App\Service\ValidatorBaseService;
use App\User\Dto\UpdateUserAvatarDto;
use App\User\Dto\UpdateUserProfileDto;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class UserProfileService
{
    public function __construct(
        private EntityManagerInterface $em,
        private ValidatorBaseService $validator,
        private FileUploaderService $fileUploader,
        private JWTTokenManagerInterface $jwtManager,
        private ParameterBagInterface $params,
    ) {
    }

    public function updateProfile(Users $user, UpdateUserProfileDto $dto): string
    {
        $this->validator->CatchInvalidData($dto);

        if ($dto->firstName !== null) {
            $user->setFirstName(trim($dto->firstName));
        }

        if ($dto->lastName !== null) {
            $user->setLastName(trim($dto->lastName));
        }

        if ($dto->email !== null) {
            $user->setEmail(strtolower(trim($dto->email)));
        }

        $this->em->flush();

        return $this->jwtManager->create($user);
    }

    public function updateAvatar(Users $user, UpdateUserAvatarDto $dto): string
    {
        $this->validator->CatchInvalidData($dto);

        $uploadDir = rtrim((string) $this->params->get('upload_directory'), '/') . '/avatar';
        $user->setAvatarUrl($this->fileUploader->uploadFileBase64($dto->image, $uploadDir));

        $this->em->flush();

        return $this->jwtManager->create($user);
    }
}
