<?php

namespace App\Tests\Api;

use App\Tests\Factory\ProfileFactory;

final class PortfolioApiTest extends ApiTestCase
{
    public function testProtectedEndpointsRejectAnonymousRequests(): void
    {
        $client = static::createClient();
        $client->request('GET', '/v1/api/portfolio');

        self::assertResponseStatusCodeSame(401);
    }

    public function testPortfolioAndProjectCrudFlow(): void
    {
        $client = $this->createFreshAuthenticatedClient();
        $client->request(
            'POST',
            '/v1/api/portfolio',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(ProfileFactory::portfolioPayload(), JSON_THROW_ON_ERROR)
        );
        self::assertResponseStatusCodeSame(201);
        $portfolio = json_decode($client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertStringStartsWith('Foliode de Raphael', $portfolio['title']);
        self::assertNotEmpty($portfolio['url']);

        $client->request(
            'POST',
            '/v1/api/portfolio/projects',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(ProfileFactory::projectPayload(), JSON_THROW_ON_ERROR)
        );
        self::assertResponseStatusCodeSame(201);
        $project = json_decode($client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('id', $project);

        $client->request('GET', '/v1/api/portfolio/projects');
        self::assertResponseIsSuccessful();
        self::assertNotEmpty(json_decode($client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR));

        $client->request(
            'PUT',
            '/v1/api/portfolio/projects/' . $project['id'],
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['title' => 'Projet Foliode mis à jour', 'description' => 'Version publiée.', 'images' => [], 'links' => []], JSON_THROW_ON_ERROR)
        );
        self::assertResponseIsSuccessful();

        $client->request('DELETE', '/v1/api/portfolio/projects/' . $project['id']);
        self::assertResponseIsSuccessful();

        $client->request(
            'PUT',
            '/v1/api/portfolio',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'title' => 'Foliode de Raphael mis à jour',
                'subtitle' => 'Ingénieur logiciel',
                'bio' => 'Une présentation mise à jour.',
            ], JSON_THROW_ON_ERROR)
        );
        self::assertResponseIsSuccessful();

        $client->request('DELETE', '/v1/api/portfolio');
        self::assertResponseIsSuccessful();
    }

    public function testInvalidProjectBatchReturnsBadRequest(): void
    {
        $client = $this->createFreshAuthenticatedClient();
        $client->request(
            'POST',
            '/v1/api/portfolio/projects/batch',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['not-a-project-list'], JSON_THROW_ON_ERROR)
        );

        self::assertResponseStatusCodeSame(400);
    }

    public function testPortfolioCanBePublishedAndReadPublicly(): void
    {
        $client = $this->createFreshAuthenticatedClient();
        $client->request(
            'POST',
            '/v1/api/portfolio',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(ProfileFactory::portfolioPayload('pub'), JSON_THROW_ON_ERROR)
        );
        self::assertResponseStatusCodeSame(201);
        $portfolio = json_decode($client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);

        $client->request('PATCH', '/v1/api/portfolio/status/publish');
        self::assertResponseIsSuccessful();

        static::ensureKernelShutdown();
        $publicClient = static::createClient();
        $publicClient->request('GET', '/v1/api/public/portfolio/' . $portfolio['url']);
        self::assertResponseIsSuccessful();
        self::assertSame($portfolio['url'], json_decode($publicClient->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR)['url']);
    }
}
