<?php

namespace App\Github;

use App\Service\ApiRequesterService;
use App\User\Dto\GithubUserDto;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class GithubApiRequester
{
    private const GITHUB_API_BASE = 'https://api.github.com';
    private const GITHUB_API_VERSION = 'application/vnd.github.v3+json';

    public function __construct(
        private ApiRequesterService $apiRequester,
        private CacheInterface $cache,
    ) {
    }

    public function authenticateUserFromGithub(GithubUserDto $user): array
    {
        $userData = $this->apiRequester->get(
            self::GITHUB_API_BASE . '/user',
            ['Authorization' => 'Bearer ' . $user->token, 'Accept' => self::GITHUB_API_VERSION,]
        );

        if (!$userData) {
            throw new UnauthorizedHttpException('', 'Github Token is invalid');
        }

        return $userData;
    }

    public function getRepositories(string $githubLogin, string $token): array
    {
        return $this->cache->get("github_repos_{$githubLogin}", function (ItemInterface $item) use ($githubLogin, $token) {
            $item->expiresAfter(3600);

            $response = $this->apiRequester->get(
                self::GITHUB_API_BASE . "/users/{$githubLogin}/repos",
                [
                    'headers' => [
                        'Authorization' => "Bearer {$token}",
                        'Accept' => 'application/vnd.github+json',
                        'X-GitHub-Api-Version' => '2022-11-28',
                    ],
                    'query' => [
                        'sort' => 'updated',
                        'direction' => 'desc',
                        'per_page' => 100,
                        'type' => 'owner',
                    ],
                ]
            );

            return $response;
        });
    }

    public function getReadme(string $owner, string $repo, string $token): ?string
    {
        $cacheKey = "github_readme_{$owner}_{$repo}";

        return $this->cache->get($cacheKey, function (ItemInterface $item) use ($owner, $repo, $token) {
            $item->expiresAfter(3600);

            $response = $this->apiRequester->get(self::GITHUB_API_BASE . "/repos/{$owner}/{$repo}/readme", [
                [
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/vnd.github+json',
                ],
            ]);
            $data = $response;

            return base64_decode($data['content']);
        });
    }
}
