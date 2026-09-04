# datasink Contact Hygiene Skill

Clean, deduplicate, and enrich music PR contact lists with the `sink` CLI (npm: `datasink`) or the browser demo at https://datasink.dev.

## Phases

1. **Scrub** — email format, typos, disposable domains, role accounts, MX
2. **Rinse** — exact-email / fuzzy-name / cross-field dedup
3. **Soak** — LLM enrichment (needs Anthropic or OpenAI key)
4. **Steep** — outlet channel discovery via Firecrawl + LLM (needs keys)

## CLI

```bash
npx datasink demo
npx datasink scrub contacts.csv
npx datasink wash contacts.csv
npx datasink spot name@outlet.co.uk
```

Keys (optional; soak/steep skipped without them):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export FIRECRAWL_API_KEY=fc-...
```

## Browser

https://datasink.dev — drop CSV/XLSX. Scrub/rinse are local. AI phases use bring-your-own-key.

## Source

https://github.com/chrisschouk/sink-cli
