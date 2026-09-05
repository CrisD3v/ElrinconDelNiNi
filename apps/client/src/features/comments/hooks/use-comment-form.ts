'use client';

import { useState, useRef, useCallback } from 'react';
import { searchUsers } from '@/lib/api/comments';
import type { CommentUser } from '@elrincondelnini/types';

interface UseCommentFormOptions {
  onSubmit: (payload: {
    content: string;
    isSpoiler: boolean;
    image: File | null;
  }) => Promise<void>;
  onCancel?: () => void;
}

export function useCommentForm({ onSubmit, onCancel }: UseCommentFormOptions) {
  const [content, setContent] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // @mention picker
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionResults, setMentionResults] = useState<CommentUser[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const mentionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = useCallback(async (value: string) => {
    setContent(value);

    // Detect @mention trigger
    const match = value.match(/@(\w*)$/);
    if (match) {
      const query = match[1];
      setMentionQuery(query);
      setShowMentions(true);
      if (mentionTimeoutRef.current) clearTimeout(mentionTimeoutRef.current);
      mentionTimeoutRef.current = setTimeout(async () => {
        if (query.length >= 1) {
          const results = await searchUsers(query);
          setMentionResults(results);
        }
      }, 300);
    } else {
      setShowMentions(false);
      setMentionResults([]);
    }
  }, []);

  const insertMention = useCallback(
    (user: CommentUser) => {
      const newContent = content.replace(/@\w*$/, `@${user.displayName} `);
      setContent(newContent);
      setShowMentions(false);
      setMentionResults([]);
      textareaRef.current?.focus();
    },
    [content],
  );

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  }, []);

  const removeImage = useCallback(() => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!content.trim()) {
        setError('El comentario no puede estar vacío');
        return;
      }
      setSubmitting(true);
      setError(null);
      try {
        await onSubmit({ content: content.trim(), isSpoiler, image });
        setContent('');
        setIsSpoiler(false);
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al publicar');
      } finally {
        setSubmitting(false);
      }
    },
    [content, isSpoiler, image, onSubmit],
  );

  const handleCancel = useCallback(() => {
    setContent('');
    setIsSpoiler(false);
    setImage(null);
    setImagePreview(null);
    setError(null);
    onCancel?.();
  }, [onCancel]);

  return {
    content,
    isSpoiler,
    image,
    imagePreview,
    submitting,
    error,
    mentionQuery,
    mentionResults,
    showMentions,
    textareaRef,
    fileInputRef,
    handleContentChange,
    insertMention,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleCancel,
    setIsSpoiler,
    setShowMentions,
  };
}
