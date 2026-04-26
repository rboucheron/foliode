<?php

namespace App\Portfolio\Controller;

use App\Portfolio\Dto\ProjectDTO;
use App\Portfolio\Service\PortfolioService;
use App\Portfolio\Service\ProjectService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

class ProjectController extends AbstractController
{

    public function __construct(
        private ProjectService $projectService,
        private PortfolioService $portfolioService,
        private SerializerInterface $serializer
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/project', methods: ['POST'])]
    public function createProject(Request $request): JsonResponse
    {
        $project = $this->projectService->createANewProject(
            $this->portfolioService->getPortfolioByUser(
                $this->getUser()
            ),
            $this->serializer->deserialize(
                $request->getContent(),
                ProjectDTO::class,
                'json'
            )
        );

        return new JsonResponse(
            $this->projectService->serializeProject($project),
            Response::HTTP_CREATED,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/projects', methods: ['POST'])]
    public function createProjects(Request $request): JsonResponse
    {

        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return new JsonResponse(
                ['error' => 'Invalid payload, expected an array of projects'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $projectsDto = [];
        foreach ($payload as $item) {
            $projectsDto[] = $this->serializer->deserialize(
                json_encode($item, JSON_THROW_ON_ERROR),
                ProjectDTO::class,
                'json'
            );
        }

        $projects = $this->projectService->createSomesNewProjects(
            $this->portfolioService->getPortfolioByUser(
                $this->getUser()
            ),
            $projectsDto
        );

        return new JsonResponse(
            $this->projectService->serializeProjects($projects),
            Response::HTTP_CREATED,
            [],
            true
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/v1/api/portfolio/project/{id}', methods: ['PUT'])]
    public function updateProject(Request $request, string $id): JsonResponse
    {
        $updatedProject = $this->projectService->updateProject(
            $this->projectService->getProjectsByUsersAndID(
                $this->getUser(),
                $id
            )[0],
            $this->serializer->deserialize(
                $request->getContent(),
                ProjectDTO::class,
                'json'
            )
        );

        return new JsonResponse(
            $this->projectService->serializeProject($updatedProject),
            Response::HTTP_OK,
            [],
            true
        );
    }

}