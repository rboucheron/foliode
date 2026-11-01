<?php
namespace App\Tests\Api;

use App\Tests\Factory\ProfileFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

abstract class ApiTestCase extends WebTestCase
{
    protected static string $userEmail;
    protected static string $userPassword = ProfileFactory::PASSWORD;
    protected static string $authToken;

    public static function setUpBeforeClass(): void
    {
        $payload = ProfileFactory::userPayload();
        self::$userEmail = $payload['email'];

        $client = static::createClient();
        $client->request(
            'POST',
            '/v1/api/user/signup',
            [], [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload, JSON_THROW_ON_ERROR)
        );

        $data = json_decode($client->getResponse()->getContent(), true);
        if (!isset($data['token'])) {
            throw new \RuntimeException('Failed to create test user: ' . $client->getResponse()->getContent());
        }

        self::$authToken = $data['token'];
        static::ensureKernelShutdown();
    }

    protected function createAuthenticatedClient(): KernelBrowser
    {
        $client = static::createClient();
        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer ' . self::$authToken);
        return $client;
    }

    protected function createFreshAuthenticatedClient(): KernelBrowser
    {
        $payload = ProfileFactory::userPayload();
        $client = static::createClient();
        $client->request(
            'POST',
            '/v1/api/user/signup',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload, JSON_THROW_ON_ERROR)
        );

        self::assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer ' . $data['token']);

        return $client;
    }
}