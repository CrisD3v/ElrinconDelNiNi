import { ApiError } from './client';
import type { CommentsPage, Comment, CommentUser } from '@elrincondelnini/types';

export type { CommentsPage, Comment, CommentUser };

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:3001';

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ─── Fetch Comments ───────────────────────────────────────────────────────────

export async function getCommentsByManga(
  mangaId: string,
  cursor?: string,
): Promise<CommentsPage> {
  const url = new URL(`${API_BASE_URL}/comments/series/${mangaId}`);
  if (cursor) url.searchParams.set('cursor', cursor);
  const res = await fetch(url.toString());
  if (!res.ok) throw new ApiError(res.status, res.statusText);
  return res.json() as Promise<CommentsPage>;
}

export async function getCommentsByChapter(
  chapterId: string,
  cursor?: string,
): Promise<CommentsPage> {
  const url = new URL(`${API_BASE_URL}/comments/chapters/${chapterId}`);
  if (cursor) url.searchParams.set('cursor', cursor);
  const res = await fetch(url.toString());
  if (!res.ok) throw new ApiError(res.status, res.statusText);
  return res.json() as Promise<CommentsPage>;
}

// ─── Create Comment ───────────────────────────────────────────────────────────

export async function createComment(
  token: string,
  payload: {
    content: string;
    mangaId?: string;
    chapterId?: string;
    parentId?: string;
    isSpoiler?: boolean;
    image?: File | null;
  },
): Promise<Comment> {
  const fd = new FormData();
  fd.append('content', payload.content);
  if (payload.mangaId) fd.append('mangaId', payload.mangaId);
  if (payload.chapterId) fd.append('chapterId', payload.chapterId);
  if (payload.parentId) fd.append('parentId', payload.parentId);
  if (payload.isSpoiler) fd.append('isSpoiler', 'true');
  if (payload.image) fd.append('image', payload.image);

  const res = await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: authHeaders(token),
    body: fd,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => undefined);
    throw new ApiError(res.status, res.statusText, body);
  }
  return res.json() as Promise<Comment>;
}

// ─── Update Comment ───────────────────────────────────────────────────────────

export async function updateComment(
  token: string,
  commentId: string,
  data: { content?: string; isSpoiler?: boolean },
): Promise<Comment> {
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'PATCH',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new ApiError(res.status, res.statusText);
  return res.json() as Promise<Comment>;
}

// ─── Delete Comment ───────────────────────────────────────────────────────────

export async function deleteComment(token: string, commentId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new ApiError(res.status, res.statusText);
}

// ─── Like / Dislike ───────────────────────────────────────────────────────────

export async function likeComment(
  token: string,
  commentId: string,
  value: 1 | -1,
): Promise<{ voted: boolean; value: number }> {
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new ApiError(res.status, res.statusText);
  return res.json();
}

// ─── React ────────────────────────────────────────────────────────────────────

export async function reactComment(
  token: string,
  commentId: string,
  emoji: string,
): Promise<{ toggled: boolean; emoji: string }> {
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}/react`, {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ emoji }),
  });
  if (!res.ok) throw new ApiError(res.status, res.statusText);
  return res.json();
}

// ─── Report ───────────────────────────────────────────────────────────────────

export async function reportComment(
  token: string,
  commentId: string,
  reason?: string,
): Promise<{ reported: boolean; hidden: boolean }> {
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}/report`, {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new ApiError(res.status, res.statusText);
  return res.json();
}

// ─── Search users (for @mentions) ────────────────────────────────────────────

export async function searchUsers(query: string): Promise<CommentUser[]> {
  const url = new URL(`${API_BASE_URL}/comments/users/search`);
  url.searchParams.set('q', query);
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  return res.json() as Promise<CommentUser[]>;
}
