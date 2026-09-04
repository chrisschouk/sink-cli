# datasink.dev — how auth works

datasink does not run a hosted OAuth or agent registration server.

## Browser demo ([datasink.dev](https://datasink.dev))

- Scrub and rinse run entirely in your browser.
- Soak and steep use **bring-your-own-key**: you paste an Anthropic or OpenAI key (and optionally a Firecrawl key for steep). Keys stay in the browser session and are never stored on our servers.
- The only server endpoint is `/api/firecrawl-proxy`, which forwards one scrape request with the Firecrawl key you supply for that call.

## CLI (`npx datasink`)

Set provider keys in your environment when you want AI phases:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
# or
export OPENAI_API_KEY=sk-...

# steep also needs:
export FIRECRAWL_API_KEY=fc-...

npx datasink wash contacts.csv
```

Without keys, scrub / rinse / inspect / spot / demo still work. Soak and steep are skipped with a clear warning.

## What is not here

There is no `/oauth/*`, no agent claim/revoke API, and no server-side bearer token store. Discovery docs that implied those endpoints were wrong and have been removed.
