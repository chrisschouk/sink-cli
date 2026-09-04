export const config = {
  matcher: ['/', '/index.html'],
}

export default function middleware(request: Request): Response | void {
  const accept = request.headers.get('accept') || ''
  if (accept.includes('text/markdown')) {
    const markdownContent = `# datasink.dev — Data Hygiene for Music PR

sink scrubs, rinses, soaks, and steeps your contact lists.

## Overview

datasink is a data hygiene CLI and browser demo for music PR contact lists.
Scrub and rinse run locally in the browser. Soak and steep use bring-your-own-key AI providers.

## Core capabilities

- **Scrub**: format validation, typo mapping, disposable domains, role accounts, MX checks
- **Rinse**: multi-field deduplication
- **Soak**: LLM contact enrichment (your API key)
- **Steep**: outlet channel discovery via Firecrawl (your API key)

## Getting started

\`\`\`bash
npx datasink demo
npx datasink scrub contacts.csv
\`\`\`

## Links

- Web demo: https://datasink.dev
- npm: https://www.npmjs.com/package/datasink
- Source: https://github.com/chrisschouk/sink-cli
- LLM docs: https://datasink.dev/llms.txt
- Auth notes: https://datasink.dev/auth.md
- Security: https://datasink.dev/.well-known/security.txt
`

    return new Response(markdownContent, {
      status: 200,
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    })
  }
}
