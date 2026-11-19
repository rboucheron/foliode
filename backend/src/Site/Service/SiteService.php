<?php

namespace App\Site\Service;

use App\Entity\Portfolio\Portfolios;
use App\Entity\Users;
use App\Portfolio\Dto\CreatNewPortfolioDTO;
use App\Portfolio\Service\PortfolioService;
use App\Repository\PortfoliosRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class SiteService
{
    public function __construct(private PortfoliosRepository $sites, private PortfolioService $portfolios) {}

    /** @return list<Portfolios> */
    public function list(Users $user): array { return $this->sites->findBy(['users' => $user]); }

    public function get(Users $user, string $id): Portfolios
    {
        $site = $this->sites->findOneBy(['id' => $id, 'users' => $user]);
        if (!$site instanceof Portfolios) { throw new NotFoundHttpException('Site not found.'); }
        return $site;
    }

    public function create(Users $user, CreateSiteDTO $dto): Portfolios
    {
        if (!$user->isMultiSiteEnabled()) { throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException('Enable multi-site mode first.'); }
        $portfolio = new CreatNewPortfolioDTO();\n        $portfolio->title = $dto->title;\n        return $this->portfolios->createNewPortfolio($user, $portfolio);
    }
}
