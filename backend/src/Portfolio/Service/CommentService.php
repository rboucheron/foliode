<?php

namespace App\Portfolio\Service;

use App\Entity\Portfolio\PortfolioComment;
use App\Entity\Portfolio\PortfolioCommentStatus;
use App\Entity\Portfolio\PortfolioStatus;
use App\Entity\Portfolio\PortfolioVisitor;
use App\Entity\Users;
use App\Portfolio\Dto\CreatePortfolioCommentDTO;
use App\Repository\PortfolioCommentsRepository;
use App\Repository\PortfolioVisitorsRepository;
use App\Service\FileUploaderService;
use App\Service\ValidatorBaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\SerializerInterface;

class CommentService
{
    private const ALLOWED_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

    public function __construct(
        private PortfolioCommentsRepository $portfolioCommentsRepository,
        private PortfolioVisitorsRepository $portfolioVisitorsRepository,
        private PortfolioService $portfolioService,
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private FileUploaderService $fileUploader,
        private ValidatorBaseService $validatorBaseService,
        private ParameterBagInterface $params,
    ) {
    }

    public function getPublicComments(string $url): array
    {
        $portfolio = $this->portfolioService->getPortfolioByUniqueUrl($url);

        return $this->portfolioCommentsRepository->findBy(
            ['portfolio' => $portfolio, 'status' => PortfolioCommentStatus::VISIBLE],
            ['createdAt' => 'DESC']
        );
    }

    public function getPortfolioComments(Users $user): array
    {
        $portfolio = $this->portfolioService->getPortfolioByUser($user);

        return $this->portfolioCommentsRepository->findBy(
            ['portfolio' => $portfolio],
            ['createdAt' => 'DESC']
        );
    }

    public function createComment(
        string $url,
        ?Users $user,
        CreatePortfolioCommentDTO $commentDTO,
        ?UploadedFile $avatarFile = null
    ): PortfolioComment {
        $portfolio = $this->portfolioService->getPortfolioByUniqueUrl($url);

        if ($portfolio->getStatus() !== PortfolioStatus::PUBLISHED) {
            throw new NotFoundHttpException('Portfolio not found.');
        }

        $this->validatorBaseService->CatchInvalidData($commentDTO);

        $comment = (new PortfolioComment())
            ->setPortfolio($portfolio)
            ->setMessage(trim($commentDTO->message))
            ->setStatus(PortfolioCommentStatus::VISIBLE);

        if ($user !== null) {
            $comment->setUser($user);
        } else {
            $firstname = trim((string) $commentDTO->firstname);
            $lastname = trim((string) $commentDTO->lastname);

            if ($firstname === '') {
                throw new BadRequestHttpException(json_encode(['error' => ['firstname' => 'firstname is required.']], JSON_UNESCAPED_UNICODE));
            }

            if ($lastname === '') {
                throw new BadRequestHttpException(json_encode(['error' => ['lastname' => 'lastname is required.']], JSON_UNESCAPED_UNICODE));
            }

            $visitor = (new PortfolioVisitor())
                ->setFirstname($firstname)
                ->setLastname($lastname);

            if ($avatarFile !== null) {
                $visitor->setAvatarUrl($this->uploadAvatar($avatarFile));
            }

            $this->em->persist($visitor);
            $comment->setVisitor($visitor);
        }

        $this->em->persist($comment);
        $this->em->flush();

        return $comment;
    }

    public function hideComment(Users $user, string $commentId): PortfolioComment
    {
        $comment = $this->portfolioCommentsRepository->findOneBy(['id' => $commentId]);

        if ($comment === null) {
            throw new NotFoundHttpException('Comment not found.');
        }

        if ($comment->getPortfolio()?->getUsers()?->getId() !== $user->getId()) {
            throw new AccessDeniedHttpException('You are not allowed to manage this comment.');
        }

        $comment->setStatus(PortfolioCommentStatus::HIDDEN);
        $comment->setHiddenAt(new \DateTimeImmutable());

        $this->em->flush();

        return $comment;
    }

    public function serializeComment(PortfolioComment $comment): string
    {
        return $this->serializer->serialize($comment, 'json', ['groups' => 'getPortfolioComment']);
    }

    public function serializeComments(array $comments): string
    {
        return $this->serializer->serialize($comments, 'json', ['groups' => 'getPortfolioComment']);
    }

    private function uploadAvatar(UploadedFile $avatarFile): string
    {
        if (!in_array($avatarFile->getMimeType(), self::ALLOWED_IMAGE_MIME_TYPES, true)) {
            throw new BadRequestHttpException(json_encode(['error' => ['avatar' => 'format du fichier invalide']], JSON_UNESCAPED_UNICODE));
        }

        $uploadDir = rtrim((string) $this->params->get('upload_directory'), '/') . '/portfolio/visitor';

        return $this->fileUploader->uploadFile($avatarFile, $uploadDir);
    }
}