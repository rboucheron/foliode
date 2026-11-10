<?php

namespace App\Github\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class GithubProjectController extends AbstractController
{
	#[Route('/github/hello', name: 'github_hello_world', methods: ['GET'])]
	public function helloWorld(): Response
	{
		return new Response('Hello World');
	}
}

