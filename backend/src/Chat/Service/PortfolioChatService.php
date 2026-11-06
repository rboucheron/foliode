<?php

namespace App\Chat\Service;

use App\Entity\Portfolio\Portfolios;
use DOMDocument;
use DOMElement;
use DOMNode;
use DOMXPath;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

final class PortfolioChatService
{
    private DOMDocument $aiml;
    private ?DOMDocument $englishAiml = null;

    public function __construct(string $aimlFile, ?string $englishAimlFile = null)
    {
        $this->aiml = $this->loadAimlFile($aimlFile);
        if ($englishAimlFile !== null && is_readable($englishAimlFile)) {
            $this->englishAiml = $this->loadAimlFile($englishAimlFile);
        }
    }

    public function answer(Portfolios $portfolio, string $message, string $locale = 'fr'): string
    {
        return $this->respond($portfolio, $message, $locale)['answer'];
    }

    /**
     * @return array{answer: string, action?: string}
     */
    public function respond(Portfolios $portfolio, string $message, string $locale = 'fr'): array
    {
        $variables = $this->buildVariables($portfolio);
        $normalizedMessage = $this->normalize($message);
        $xpath = new DOMXPath($locale === 'en' && $this->englishAiml !== null ? $this->englishAiml : $this->aiml);

        foreach ($xpath->query('//category') as $category) {
            if (!$category instanceof DOMElement) {
                continue;
            }

            $patternNode = $xpath->query('./pattern', $category)->item(0);
            $template = $xpath->query('./template', $category)->item(0);
            if (!$patternNode instanceof DOMElement || !$template instanceof DOMElement) {
                continue;
            }

            $captures = $this->match($this->normalize($patternNode->textContent), $normalizedMessage);
            if ($captures === null) {
                continue;
            }

            $variables['star'] = $captures[0] ?? '';

            $response = ['answer' => $this->render($template, $variables)];
            $action = $xpath->query('./action', $template)->item(0);
            if ($action instanceof DOMElement && $action->getAttribute('name') !== '') {
                $response['action'] = $action->getAttribute('name');
            }

            return $response;
        }

        throw new ServiceUnavailableHttpException(null, 'No AIML response rule matched the message.');
    }

    private function loadAimlFile(string $aimlFile): DOMDocument
    {
        if (!is_readable($aimlFile)) {
            throw new \RuntimeException(sprintf('AIML file is not readable: %s', $aimlFile));
        }

        $document = new DOMDocument();
        $document->preserveWhiteSpace = true;
        $previousErrors = libxml_use_internal_errors(true);
        $loaded = $document->load($aimlFile, LIBXML_NONET);
        $errors = libxml_get_errors();
        libxml_clear_errors();
        libxml_use_internal_errors($previousErrors);
        if (!$loaded) {
            $details = $errors[0]->message ?? 'Invalid XML.';
            throw new \RuntimeException('Unable to load AIML file: '.trim($details));
        }

        return $document;
    }

    /**
     * @return array<string, string>
     */
    private function buildVariables(Portfolios $portfolio): array
    {
        $projects = [];
        foreach ($portfolio->getProjects() as $project) {
            $description = trim((string) $project->getDescription());
            $line = (string) $project->getTitle();
            if ($description !== '') {
                $line .= ' - '.$description;
            }
            $projects[] = $line;
        }

        return [
            'portfolio_title' => (string) ($portfolio->getTitle() ?? ''),
            'author' => (string) ($portfolio->getAuthor() ?? ''),
            'bio' => (string) ($portfolio->getBio() ?? ''),
            'bio_present' => trim((string) $portfolio->getBio()) === '' ? '0' : '1',
            'project_count' => (string) count($projects),
            'project_list' => $projects === [] ? '' : implode("\n", array_map(
                static fn (string $project, int $index): string => sprintf('%d. %s', $index + 1, $project),
                $projects,
                array_keys($projects)
            )),
        ];
    }

    /**
     * @return list<string>|null
     */
    private function match(string $pattern, string $message): ?array
    {
        $quotedPattern = preg_quote($pattern, '/');
        $regex = str_replace(' \*', '(?: (.*))?', $quotedPattern);
        $regex = str_replace('\*', '(.*)', $regex);
        $regex = '/^'.$regex.'$/u';

        return preg_match($regex, $message, $matches) === 1 ? array_slice($matches, 1) : null;
    }

    /**
     * @param array<string, string> $variables
     */
    private function render(DOMNode $node, array $variables): string
    {
        $result = '';
        foreach ($node->childNodes as $child) {
            if ($child->nodeType === XML_TEXT_NODE) {
                $result .= $child->nodeValue;
                continue;
            }

            if (!$child instanceof DOMElement) {
                continue;
            }

            if ($child->tagName === 'get') {
                $result .= $variables[$child->getAttribute('name')] ?? '';
                continue;
            }

            if ($child->tagName === 'star') {
                $result .= $variables['star'] ?? '';
                continue;
            }

            if ($child->tagName === 'condition') {
                $result .= $this->renderCondition($child, $variables);
                continue;
            }

            if ($child->tagName === 'br') {
                $result .= "\n";
                continue;
            }

            $result .= $this->render($child, $variables);
        }

        return trim((string) preg_replace('/[ \t]+/', ' ', $result));
    }

    /**
     * @param array<string, string> $variables
     */
    private function renderCondition(DOMElement $condition, array $variables): string
    {
        $name = $condition->getAttribute('name');
        $currentValue = $variables[$name] ?? '';

        foreach ($condition->childNodes as $child) {
            if (!$child instanceof DOMElement || $child->tagName !== 'li') {
                continue;
            }

            $expected = $child->getAttribute('value');
            if ($expected !== '' && $expected !== $currentValue) {
                continue;
            }

            return $this->render($child, $variables);
        }

        return '';
    }

    private function normalize(string $value): string
    {
        $value = trim((string) preg_replace('/\s+/u', ' ', $value));
        $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) ?: $value;

        return strtoupper($value);
    }
}
