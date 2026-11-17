interface UsernameLoginDependencies {
  origins: string[];
  resolve(username: string): Promise<{ allowed: boolean; email?: string }>;
  authenticate(email: string, password: string): Promise<{ access_token: string; refresh_token: string } | null>;
}

export function createUsernameLogin({ origins, resolve, authenticate }: UsernameLoginDependencies) {
  return async (request: Request) => {
    const origin = request.headers.get('Origin');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Vary': 'Origin'
    });
    const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
    if (!origin || !origins.includes(origin)) return reply(403, { error: 'Request rejected' });

    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Headers', 'apikey, content-type');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return reply(405, { error: 'Method not allowed' });

    // Bound the body before parsing, including requests with no Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: 'Invalid request' });
    let bytes = 0;
    let body = '';
    const decoder = new TextDecoder();
    let input: { username?: unknown; password?: unknown };
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 2048) {
          await reader.cancel();
          return reply(413, { error: 'Request too large' });
        }
        body += decoder.decode(value, { stream: true });
      }
      input = JSON.parse(body + decoder.decode());
    } catch {
      return reply(400, { error: 'Invalid request' });
    }

    const { username, password } = input ?? {};
    if (typeof username !== 'string' || !/^[a-z][a-z0-9_]{2,31}$/.test(username) ||
        typeof password !== 'string' || !password || password.length > 128) {
      return reply(401, { error: 'Unable to sign in' });
    }
    try {
      const match = await resolve(username);
      if (!match.allowed) return reply(429, { error: 'Try again later' });
      const tokens = await authenticate(match.email ?? 'unregistered-member@invalid.example', password);
      if (!match.email || !tokens) return reply(401, { error: 'Unable to sign in' });
      return reply(200, tokens);
    } catch {
      return reply(503, { error: 'Sign-in service unavailable' });
    }
  };
}
