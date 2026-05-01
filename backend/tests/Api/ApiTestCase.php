<?php
namespace App\Tests\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

abstract class ApiTestCase extends WebTestCase
{
    protected static string $userEmail;
    protected static string $userPassword = 'PAssword34434??';
    protected static string $authToken;

    public static function setUpBeforeClass(): void
    {
        self::$userEmail = 'test+' . uniqid() . '@gmail.com';

        $client = static::createClient();
        $client->request(
            'POST',
            '/v1/api/user/signup',
            [], [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'firstName' => 'Test',
                'lastName'  => 'User',
                'email'     => self::$userEmail,
                'password'  => self::$userPassword,
            ])
        );

        $data = json_decode($client->getResponse()->getContent(), true);
        if (!isset($data['token'])) {
            throw new \RuntimeException('Failed to create test user: ' . $client->getResponse()->getContent());
        }
        self::$authToken = $data['token'];
    }

    protected function createAuthenticatedClient(): KernelBrowser
    {
        $client = static::createClient();
        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer ' . self::$authToken);
        return $client;
    }
}