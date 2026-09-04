/**
 * Tiny health endpoint for uptime checks and the OpenAPI catalog.
 * No secrets, no side effects.
 */

export const config = { runtime: 'edge' }

export default function handler(): Response {
  return new Response(
    JSON.stringify({
      status: 'ok',
      version: '0.4.1',
      service: 'datasink',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    },
  )
}
