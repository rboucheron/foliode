<?php
namespace App\Portfolio\Service;

use App\Entity\Portfolio\Portfolios;
use App\Entity\Portfolio\Projects;
use App\Entity\Portfolio\ProjectsImages;
use App\Entity\Portfolio\ProjectsLinks;
use App\Entity\Users;
use App\Portfolio\Dto\ProjectDTO;
use App\Repository\ProjectsRepository;
use App\Service\FileUploaderService;
use App\Service\ValidatorBaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\SerializerInterface;

class ProjectService
{
    public function __construct(
        private ProjectsRepository $projectsRepository,
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private ValidatorBaseService $validatorBaseService,
        private FileUploaderService $fileUploader,
        private ParameterBagInterface $params
    ) {
    }

    public function createANewProject(Portfolios $portfolio, ProjectDTO $project): Projects
    {
        $this->validatorBaseService->CatchInvalidData($project);
        $newProject = (new Projects())
            ->setPortfolio($portfolio)
            ->setTitle($project->title)
            ->addProjectsImage(...$this->uploadImages($project->images))
            ->setDescription($project->description)
            ->addProjectsLink(...$this->buildLinks($project->links))
            ->setUser($portfolio->getUsers());
        $this->emPersist($newProject);

        return $newProject;
    }

    public function createSomesNewProjects(Portfolios $portfolio, array $projects): array
    {
        foreach ($projects as &$project) {
            $project = $this->createANewProject($portfolio, $project);
        }

        return $projects;
    }

    public function getProjectsByUsersAndID(Users $user, string $id): array
    {
        $projects = $this->projectsRepository->findBy(['user' => $user, 'id' => $id]);

        if ($projects === []) {
            throw new NotFoundHttpException('Projet non trouve.');
        }

        return $projects;
    }

    public function updateProject(Projects $project, ProjectDTO $projectDTO): Projects
    {
        $this->validatorBaseService->CatchInvalidData($projectDTO);
        $project->setTitle($projectDTO->title ?? $project->getTitle())
            ->setDescription($projectDTO->description ?? $project->getDescription())
            ->addProjectsImage(...$this->uploadImages($projectDTO->images) ?? $project->getProjectsImages()->toArray())
            ->addProjectsLink(...$this->buildLinks($projectDTO->links) ?? $project->getProjectsLinks()->toArray());
        $this->em->flush();

        return $project;
    }

    private function uploadImages(array $images): array
    {
        $uploadDir = rtrim((string) $this->params->get('upload_directory'), '/') . '/project';

        foreach ($images as &$image) {
            $uplodedImage = $this->fileUploader->uploadFileBase64($image['file'], $uploadDir);
            $imageEntity = new ProjectsImages();
            $imageEntity->setImgSrc($uplodedImage);
            $imageEntity->setImgAlt($image['alt'] ?? '');

            $image = $imageEntity;
        }

        return $images;
    }

    private function buildLinks(array $links): array
    {
        $linkEntities = [];

        foreach ($links as $link) {
            if (!is_array($link)) {
                continue;
            }

            if (empty($link['url'])) {
                continue;
            }

            $linkEntity = new ProjectsLinks();
            $linkEntity->setName((string) ($link['name'] ?? 'link'));
            $linkEntity->setUrl((string) $link['url']);
            $linkEntities[] = $linkEntity;
        }

        return $linkEntities;
    }

    public function emPersist(Projects $project): void
    {
        $this->em->persist($project);
        $this->em->flush();
    }

    public function serializeProject(Projects $project): string
    {
        return $this->serializer->serialize($project, 'json', ['groups' => 'getProject']);
    }

    public function serializeProjects(array $projects): string
    {
        return $this->serializer->serialize($projects, 'json', ['groups' => 'getProjects']);
    }

}