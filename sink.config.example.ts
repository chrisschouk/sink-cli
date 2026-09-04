import type { SinkConfig } from './src/types.js';

const config: Partial<SinkConfig> = {
  scrub: {
    // Path to custom domain typo correction map (JSON)
    // typoMap: './data/custom-typos.json',

    // Override role-based email prefixes
    // rolePrefixes: ['info', 'admin', 'press', 'submissions'],

    // Override catch-all domain list
    // catchAllDomains: ['gmail.com', 'yahoo.com'],

    // MX cache TTL in seconds (default: 1800)
    // mxCacheTTL: 1800,
  },

  rinse: {
    // Jaro-Winkler similarity threshold for fuzzy name matching (default: 0.92)
    // fuzzyThreshold: 0.92,

    // Dedup strategies to run, in order
    // strategies: ['exact-email', 'fuzzy-name', 'cross-field'],
  },

  soak: {
    // Vendor: 'anthropic' | 'openai'. CLI shortcuts: --provider haiku|sonnet|opus|codex|gpt-4o-mini
    // Any model ID: --provider anthropic --model claude-…  /  --provider openai --model gpt-…
    provider: 'anthropic',

    // Anthropic — model string is free-form (aliases: haiku, sonnet, opus)
    anthropic: {
      model: 'claude-haiku-4-5-20251001',
      apiKey: process.env.ANTHROPIC_API_KEY,
    },

    // OpenAI — model string is free-form (aliases: gpt-4o-mini, codex)
    // openai: {
    //   model: 'gpt-4o-mini',
    //   apiKey: process.env.OPENAI_API_KEY,
    // },
  },

  steep: {
    // Extractor vendor mirrors soak unless overridden. Same free-form model IDs.
    // extractor: 'anthropic',
    // anthropic: { model: 'claude-haiku-4-5-20251001' },
  },

  output: {
    format: 'csv',
    locale: 'en-GB',
  },
};

export default config;
