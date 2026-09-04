/**
 * Shared LLM vendor/model resolution for soak + steep.
 *
 * Shortcuts (haiku, sonnet, …) are convenience aliases only. Any Anthropic or
 * OpenAI model ID is accepted via --model / config — providers pass the string
 * straight through to the vendor SDK.
 */

export const KNOWN_PROVIDERS = ['anthropic', 'openai'] as const
export type KnownProvider = (typeof KNOWN_PROVIDERS)[number]

/** Friendly shortcut → vendor + concrete model ID. */
export const MODEL_SHORTCUTS: Record<string, { provider: KnownProvider; model: string }> = {
  haiku: { provider: 'anthropic', model: 'claude-haiku-4-5-20251001' },
  sonnet: { provider: 'anthropic', model: 'claude-sonnet-4-5-20250514' },
  opus: { provider: 'anthropic', model: 'claude-opus-4-0-20250514' },
  codex: { provider: 'openai', model: 'codex-mini-latest' },
  'gpt-4o-mini': { provider: 'openai', model: 'gpt-4o-mini' },
}

/** Expand a shortcut alias to a concrete model ID; pass through unknown strings. */
export function expandModelId(model: string): string {
  return MODEL_SHORTCUTS[model]?.model ?? model
}

export interface LlmChoice {
  provider?: KnownProvider
  model?: string
}

export interface LlmChoiceResult extends LlmChoice {
  error?: string
}

/**
 * Resolve CLI/config LLM selection.
 *
 * - `--provider haiku|sonnet|opus|codex|gpt-4o-mini` → vendor + default model
 * - `--provider anthropic|openai` → vendor only (provider default model)
 * - `--model <id>` → any model string (aliases expanded); needs a vendor unless
 *   the model itself is a known shortcut
 * - Combining `--provider anthropic --model claude-…` (or any ID) works
 */
export function resolveLlmChoice(opts: { provider?: string; model?: string }): LlmChoiceResult {
  const rawProvider = opts.provider?.trim()
  const rawModel = opts.model?.trim()

  if (rawProvider && MODEL_SHORTCUTS[rawProvider]) {
    const shortcut = MODEL_SHORTCUTS[rawProvider]
    return {
      provider: shortcut.provider,
      model: rawModel ? expandModelId(rawModel) : shortcut.model,
    }
  }

  if (rawProvider && (KNOWN_PROVIDERS as readonly string[]).includes(rawProvider)) {
    return {
      provider: rawProvider as KnownProvider,
      model: rawModel ? expandModelId(rawModel) : undefined,
    }
  }

  if (!rawProvider && rawModel) {
    const shortcut = MODEL_SHORTCUTS[rawModel]
    if (shortcut) {
      return { provider: shortcut.provider, model: shortcut.model }
    }
    return {
      error: `Pass --provider anthropic|openai with --model ${rawModel} (cannot infer vendor from a free-form model ID).`,
    }
  }

  if (rawProvider) {
    return {
      error: `Unknown provider '${rawProvider}'. Use anthropic|openai, or a shortcut (haiku|sonnet|opus|codex|gpt-4o-mini).`,
    }
  }

  return {}
}

export function defaultModelFor(provider: KnownProvider): string {
  return provider === 'openai' ? 'gpt-4o-mini' : 'claude-haiku-4-5-20251001'
}
