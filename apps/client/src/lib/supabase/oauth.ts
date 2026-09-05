/**
 * Supabase OAuth Server Endpoints and Configuration
 */

export const SUPABASE_OAUTH_CONFIG = {
  consentPath: '/oauth/consent',
  authorizeEndpoint: 'https://vyowfhvbqffklhibqqmv.supabase.co/auth/v1/oauth/authorize',
  tokenEndpoint: 'https://vyowfhvbqffklhibqqmv.supabase.co/auth/v1/oauth/token',
  jwksEndpoint: 'https://vyowfhvbqffklhibqqmv.supabase.co/auth/v1/.well-known/jwks.json',
  oidcDiscoveryEndpoint: 'https://vyowfhvbqffklhibqqmv.supabase.co/auth/v1/.well-known/openid-configuration',
} as const;

/**
 * Returns the default OAuth redirect URI for the current origin.
 */
export function getOAuthRedirectUri(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  return 'http://localhost:3000/auth/callback';
}

/**
 * Builds an authorization URL for third-party OAuth flows with Supabase OAuth server.
 */
export function buildOAuthAuthorizeUrl(params: {
  clientId: string;
  redirectUri?: string;
  responseType?: 'code';
  scope?: string;
  state?: string;
  codeChallenge?: string;
  codeChallengeMethod?: 'S256';
}): string {
  const url = new URL(SUPABASE_OAUTH_CONFIG.authorizeEndpoint);
  url.searchParams.set('client_id', params.clientId);
  url.searchParams.set('redirect_uri', params.redirectUri || getOAuthRedirectUri());
  url.searchParams.set('response_type', params.responseType || 'code');
  url.searchParams.set('scope', params.scope || 'openid email profile');

  if (params.state) {
    url.searchParams.set('state', params.state);
  }
  if (params.codeChallenge) {
    url.searchParams.set('code_challenge', params.codeChallenge);
    url.searchParams.set('code_challenge_method', params.codeChallengeMethod || 'S256');
  }

  return url.toString();
}

/**
 * Exchange an OAuth authorization code for tokens using the Supabase Token Endpoint.
 */
export async function exchangeOAuthToken(params: {
  clientId: string;
  clientSecret?: string;
  code: string;
  redirectUri?: string;
  codeVerifier?: string;
}) {
  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('client_id', params.clientId);
  body.set('code', params.code);
  body.set('redirect_uri', params.redirectUri || getOAuthRedirectUri());

  if (params.clientSecret) {
    body.set('client_secret', params.clientSecret);
  }
  if (params.codeVerifier) {
    body.set('code_verifier', params.codeVerifier);
  }

  const response = await fetch(SUPABASE_OAUTH_CONFIG.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Token exchange failed');
    throw new Error(`OAuth Token Error (${response.status}): ${errText}`);
  }

  return response.json();
}
