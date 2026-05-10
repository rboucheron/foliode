<?php

namespace App\User\Service;

use App\Entity\Users;
use App\Service\MailerService;
use App\Service\InternalServerExceptionService;
use Doctrine\ORM\EntityManagerInterface;

class UserEmailVerificationCodeService
{
    public function __construct(
        private MailerService $mailerService,
        private InternalServerExceptionService $internalServerExceptionService,
        private EntityManagerInterface $em,
    ) {
    }

    public function sendWelcomeEmail(Users $user): void
    {
        try {
            $verificationCode = random_int(100000, 999999);
            $subject = 'Vérification de votre adresse email';
            $content = "Votre code de vérification est : $verificationCode";

            $this->mailerService->sendEmail($subject, $content, $user->getEmail());

            $user->setEmailVerificationCode($verificationCode);
            $this->em->flush();

        } catch (\Exception $e) {
            $this->internalServerExceptionService->raise('VerificationCodeSendingFailed', $e);
        }

    }

    public function verifyEmail(Users $user, int $code): bool
    {
        if ($user->getEmailVerificationCode() === $code) {
            $user->setIsEmailVerified(true);
            $user->setEmailVerificationCode(null);
            $this->em->flush();
            return true;
        }
        return false;
    }
}