<?php

namespace App\Portfolio\Service;

use App\Entity\Portfolio\Tools;
use App\Entity\Users;
use App\Portfolio\Dto\ToolDTO;
use App\Repository\ToolsRepository;
use App\Service\FileUploaderService;
use App\Service\ValidatorBaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\SerializerInterface;

class ToolService
{
    public function __construct(
        private ToolsRepository $toolsRepository,
        private PortfolioService $portfolioService,
        private EntityManagerInterface $em,
        private FileUploaderService $fileUploader,
        private ValidatorBaseService $validator,
        private ParameterBagInterface $params,
        private SerializerInterface $serializer,
    ) {
    }

    public function getPortfolioTools(Users $user): array
    {
        $portfolio = $this->portfolioService->getPortfolioByUser($user);

        return $portfolio->getTools()->toArray();
    }

    public function createTool(Users $user, ToolDTO $dto): Tools
    {
        $this->validator->CatchInvalidData($dto);

        if ($dto->image === null) {
            throw new BadRequestHttpException('Image is required.');
        }

        $portfolio = $this->portfolioService->getPortfolioByUser($user);
        $uploadDir = rtrim((string) $this->params->get('upload_directory'), '/') . '/tool';

        $tool = (new Tools())
            ->setName($dto->name)
            ->setPicto($this->fileUploader->uploadFileBase64($dto->image, $uploadDir));

        $tool->addPortfolio($portfolio);

        $this->em->persist($tool);
        $this->em->flush();

        return $tool;
    }

    public function createTools(Users $user, array $tools): array
    {
        foreach ($tools as &$tool) {
            $tool = $this->createTool($user, $tool);
        }

        return $tools;
    }

    public function updateTool(Users $user, string $id, ToolDTO $dto): Tools
    {
        $this->validator->CatchInvalidData($dto);

        $tool = $this->getToolByUserAndId($user, $id);
        $uploadDir = rtrim((string) $this->params->get('upload_directory'), '/') . '/tool';

        $tool->setName($dto->name);

        if ($dto->image !== null) {
            $tool->setPicto($this->fileUploader->uploadFileBase64($dto->image, $uploadDir));
        }

        $this->em->flush();

        return $tool;
    }

    public function deleteTool(Users $user, string $id): void
    {
        $tool = $this->getToolByUserAndId($user, $id);
        $this->em->remove($tool);
        $this->em->flush();
    }

    public function serializeTool(Tools $tool): string
    {
        return $this->serializer->serialize($tool, 'json', ['groups' => 'getPortfolio']);
    }

    public function serializeTools(array $tools): string
    {
        return $this->serializer->serialize($tools, 'json', ['groups' => 'getPortfolio']);
    }

    private function getToolByUserAndId(Users $user, string $id): Tools
    {
        $tool = $this->toolsRepository->findOneBy(['id' => $id]);

        if ($tool === null) {
            throw new NotFoundHttpException('Tool not found.');
        }

        $portfolio = $this->portfolioService->getPortfolioByUser($user);

        if (!$portfolio->getTools()->contains($tool)) {
            throw new AccessDeniedHttpException('You are not allowed to access this tool.');
        }

        return $tool;
    }
}
