import { ApiError } from './client';

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:3001';

import type { UserMe } from '@elrincondelnini/types';
export type { UserMe };

/**
 * Fetch the current authenticated user's profile from NestJS API.
 */
export async function getMe(accessToken: string): Promise<UserMe> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => undefined);
    throw new ApiError(response.status, response.statusText, body);
  }

  return response.json() as Promise<UserMe>;
}

/**
 * Update the user profile (display name, description, profileImage file).
 */
export async function updateProfile(
  accessToken: string,
  formData: FormData,
): Promise<UserMe> {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => undefined);
    throw new ApiError(response.status, response.statusText, body);
  }

  return response.json() as Promise<UserMe>;
}
