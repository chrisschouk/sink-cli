import { useState } from 'react'
import type { ApiKeys } from '../types'

const STORE_PROVIDER = 'sink:provider'
const STORE_API_KEY = 'sink:apiKey'
const STORE_MODEL = 'sink:model'
const STORE_FIRECRAWL = 'sink:firecrawl'

const DEFAULT_MODELS = {
  anthropic: 'claude-haiku-4-5-20251001',
  openai: 'gpt-4o-mini',
} as const

function readStored(key: string): string {
  try {
    return sessionStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

/**
 * Terminal-styled key entry, shown after rinse. Bring your own Anthropic or
 * OpenAI key (any model ID) for soak; add Firecrawl to also unlock steep.
 * Keys live in memory only unless the user opts into sessionStorage.
 */
export function ApiKeyPanel({
  onRun,
  onSkip,
}: {
  onRun: (keys: ApiKeys) => void
  onSkip: () => void
}) {
  const storedProvider = (readStored(STORE_PROVIDER) as 'anthropic' | 'openai') || 'anthropic'
  const [provider, setProvider] = useState<'anthropic' | 'openai'>(
    storedProvider === 'openai' ? 'openai' : 'anthropic',
  )
  const [apiKey, setApiKey] = useState(readStored(STORE_API_KEY))
  const [model, setModel] = useState(readStored(STORE_MODEL) || DEFAULT_MODELS[storedProvider === 'openai' ? 'openai' : 'anthropic'])
  const [firecrawl, setFirecrawl] = useState(readStored(STORE_FIRECRAWL))
  const [remember, setRemember] = useState(Boolean(readStored(STORE_API_KEY)))
  const [err, setErr] = useState<string | null>(null)

  const switchProvider = (next: 'anthropic' | 'openai') => {
    setProvider(next)
    // Reset model to vendor default when switching unless user already typed a custom one
    // that still looks like it belongs — keep it simple: always swap default.
    setModel(DEFAULT_MODELS[next])
  }

  const submit = () => {
    const key = apiKey.trim()
    const modelId = model.trim()
    const f = firecrawl.trim()
    if (!key) {
      setErr('An API key is required to run AI enrichment.')
      return
    }
    if (provider === 'anthropic' && !key.startsWith('sk-ant-')) {
      setErr('That doesn’t look like an Anthropic key (expected sk-ant-…).')
      return
    }
    if (provider === 'openai' && !key.startsWith('sk-')) {
      setErr('That doesn’t look like an OpenAI key (expected sk-…).')
      return
    }
    if (!modelId) {
      setErr('A model ID is required (any current Anthropic or OpenAI model string).')
      return
    }
    if (f && !f.startsWith('fc-')) {
      setErr('That doesn’t look like a Firecrawl key (expected fc-…).')
      return
    }
    try {
      if (remember) {
        sessionStorage.setItem(STORE_PROVIDER, provider)
        sessionStorage.setItem(STORE_API_KEY, key)
        sessionStorage.setItem(STORE_MODEL, modelId)
        if (f) sessionStorage.setItem(STORE_FIRECRAWL, f)
        else sessionStorage.removeItem(STORE_FIRECRAWL)
      } else {
        sessionStorage.removeItem(STORE_PROVIDER)
        sessionStorage.removeItem(STORE_API_KEY)
        sessionStorage.removeItem(STORE_MODEL)
        sessionStorage.removeItem(STORE_FIRECRAWL)
      }
    } catch {
      // sessionStorage may be unavailable (private mode) — keys still work in-memory.
    }
    setErr(null)
    onRun({ provider, apiKey: key, model: modelId, firecrawl: f || undefined })
  }

  return (
    <div className="keypanel" aria-label="API keys for AI enrichment">
      <p className="keypanel-title">
        <span className="cyan">◇</span> Run the AI phases?
      </p>
      <p className="dim keypanel-lead">
        Scrub &amp; rinse are done — locally. <span className="cyan">Soak</span> enriches each
        contact (genres, platform, pitch tips); <span className="cyan">steep</span> researches each
        outlet (submission portals, socials, recent coverage). Bring your own keys — any Anthropic
        or OpenAI model.
      </p>

      <fieldset className="keypanel-field keypanel-vendor">
        <legend className="dim">Vendor</legend>
        <label className="keypanel-radio">
          <input
            type="radio"
            name="vendor"
            checked={provider === 'anthropic'}
            onChange={() => switchProvider('anthropic')}
          />{' '}
          Anthropic
        </label>
        <label className="keypanel-radio">
          <input
            type="radio"
            name="vendor"
            checked={provider === 'openai'}
            onChange={() => switchProvider('openai')}
          />{' '}
          OpenAI
        </label>
      </fieldset>

      <label className="keypanel-field">
        <span>
          {provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API key{' '}
          <span className="dim">— for soak (required)</span>
        </span>
        <input
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder={provider === 'anthropic' ? 'sk-ant-…' : 'sk-…'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
      </label>

      <label className="keypanel-field">
        <span>
          Model ID <span className="dim">— any current model from that vendor</span>
        </span>
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={DEFAULT_MODELS[provider]}
          value={model}
          onChange={(e) => setModel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
      </label>

      <label className="keypanel-field">
        <span>
          Firecrawl API key <span className="dim">— for steep (optional)</span>
        </span>
        <input
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="fc-…"
          value={firecrawl}
          onChange={(e) => setFirecrawl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
      </label>

      <label className="keypanel-remember dim">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />{' '}
        Remember keys for this browser session
      </label>

      {err && <p className="red keypanel-error">{err}</p>}

      <div className="keypanel-actions">
        <button type="button" className="download-button" onClick={submit}>
          Run AI phases
        </button>
        <button type="button" className="reset-button" onClick={onSkip}>
          Skip — download clean CSV
        </button>
      </div>

      <p className="dim keypanel-privacy">
        Your keys stay in this browser and are never sent to our servers. Running the AI phases sends
        your contact data to <strong>{provider === 'anthropic' ? 'Anthropic' : 'OpenAI'}</strong>
        {firecrawl.trim() ? (
          <>
            , and outlet pages to <strong>Firecrawl</strong> (via a thin open-source proxy, because
            Firecrawl blocks direct browser calls)
          </>
        ) : null}
        . Scrub &amp; rinse never leave your machine.
      </p>
    </div>
  )
}
