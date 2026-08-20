export async function onRequest(context) {
  const data = {
    status: 'online',
    platform: 'Cloudflare Pages Functions',
    game: 'GoldenEye 007 C Decompilation (N64 ROM)',
    version: '1.0.0',
    rom: 'ge007.u.z64',
    sha1: 'abe01e4aeb033b6c0836819f549c791b26cfde83',
    environment: context.env?.ENVIRONMENT || 'production',
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  });
}
