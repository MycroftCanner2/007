export async function onRequest(context) {
  const url = new URL(context.request.url);
  const response = await context.next();
  const newHeaders = new Headers(response.headers);

  // Set required headers for WASM / SharedArrayBuffer and CORS
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  newHeaders.set('Access-Control-Allow-Headers', '*');
  newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
  newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');

  // If a request for a build artifact returned an HTML fallback page, convert to a 404 JSON response
  if (url.pathname.startsWith('/build/')) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      newHeaders.set('Content-Type', 'application/json');
      return new Response(JSON.stringify({
        error: 'ROM artifact not found',
        message: 'The compiled N64 ROM is not hosted on the web server. Please upload your GoldenEye 007 ROM file or build it locally with make.'
      }), {
        status: 404,
        statusText: 'Not Found',
        headers: newHeaders
      });
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
