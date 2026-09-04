import { describe, it, expect } from 'vitest'
import {
  expandModelId,
  resolveLlmChoice,
  defaultModelFor,
  MODEL_SHORTCUTS,
} from '../../src/phases/soak/models.js'

describe('LLM model resolution', () => {
  it('expands shortcuts to concrete model IDs', () => {
    expect(expandModelId('haiku')).toBe(MODEL_SHORTCUTS.haiku.model)
    expect(expandModelId('sonnet')).toBe(MODEL_SHORTCUTS.sonnet.model)
    expect(expandModelId('gpt-4o-mini')).toBe('gpt-4o-mini')
  })

  it('passes through arbitrary model IDs unchanged', () => {
    expect(expandModelId('claude-opus-4-20250514')).toBe('claude-opus-4-20250514')
    expect(expandModelId('gpt-4.1-mini')).toBe('gpt-4.1-mini')
    expect(expandModelId('o4-mini')).toBe('o4-mini')
  })

  it('resolves provider shortcuts', () => {
    expect(resolveLlmChoice({ provider: 'sonnet' })).toEqual({
      provider: 'anthropic',
      model: MODEL_SHORTCUTS.sonnet.model,
    })
    expect(resolveLlmChoice({ provider: 'codex' })).toEqual({
      provider: 'openai',
      model: MODEL_SHORTCUTS.codex.model,
    })
  })

  it('allows vendor + free-form model', () => {
    expect(resolveLlmChoice({ provider: 'anthropic', model: 'claude-sonnet-4-20250514' })).toEqual({
      provider: 'anthropic',
      model: 'claude-sonnet-4-20250514',
    })
    expect(resolveLlmChoice({ provider: 'openai', model: 'gpt-4.1' })).toEqual({
      provider: 'openai',
      model: 'gpt-4.1',
    })
  })

  it('allows vendor alone (provider default model)', () => {
    expect(resolveLlmChoice({ provider: 'anthropic' })).toEqual({
      provider: 'anthropic',
      model: undefined,
    })
    expect(defaultModelFor('anthropic')).toBe('claude-haiku-4-5-20251001')
    expect(defaultModelFor('openai')).toBe('gpt-4o-mini')
  })

  it('infers vendor from model-only shortcut', () => {
    expect(resolveLlmChoice({ model: 'haiku' })).toEqual({
      provider: 'anthropic',
      model: MODEL_SHORTCUTS.haiku.model,
    })
  })

  it('errors when free-form model has no vendor', () => {
    const result = resolveLlmChoice({ model: 'gpt-4.1-mini' })
    expect(result.error).toMatch(/--provider/)
  })

  it('errors on unknown provider names', () => {
    const result = resolveLlmChoice({ provider: 'gemini' })
    expect(result.error).toMatch(/Unknown provider/)
  })

  it('lets --model override a shortcut default', () => {
    expect(resolveLlmChoice({ provider: 'haiku', model: 'claude-opus-4-0-20250514' })).toEqual({
      provider: 'anthropic',
      model: 'claude-opus-4-0-20250514',
    })
  })
})
