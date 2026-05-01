<?php 
namespace App\Tests\Api;

class CreatePortfolioTest extends ApiTestCase
{
    public function testCreatePortfolio(): void
    {
        $client = $this->createAuthenticatedClient();
        $client->request(
            'POST',
            '/v1/api/portfolio/create',
            [], [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'title' => 'Test Portfolio ' . uniqid(),
                'subtitle' => 'Test Subtitle ' . uniqid(),
                'bio' => 'Test Bio ' . uniqid()
            ])
        );

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
        $this->assertArrayHasKey('title', $data);
        $this->assertArrayHasKey('subtitle', $data);
        $this->assertArrayHasKey('bio', $data);
    }
}
