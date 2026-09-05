#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/39e66d6e1edb5f8e607c656405a4150c31fb2059f190e376852a89c90504d5d2/contract';
import startContract from '../../snapshots/39e66d6e1edb5f8e607c656405a4150c31fb2059f190e376852a89c90504d5d2/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/4d9c61473e3e9255a8aa5101b1f480a3e36940066e07575d99d7eaad348d749a/contract';
import endContract from '../../snapshots/4d9c61473e3e9255a8aa5101b1f480a3e36940066e07575d99d7eaad348d749a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'comment_likes',
        columns: [
          col('commentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('value', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'comment_reactions',
        columns: [
          col('commentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('emoji', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'comment_reports',
        columns: [
          col('commentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'comments',
        column: col('isHidden', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'comments',
        column: col('isPinned', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'comments',
        column: col('isSpoiler', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'comments',
        column: col('parentId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'comment_likes',
        constraint: 'comment_likes_commentId_userId_key',
        columns: ['commentId', 'userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'comment_reactions',
        constraint: 'comment_reactions_commentId_userId_emoji_key',
        columns: ['commentId', 'userId', 'emoji'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'comment_reports',
        constraint: 'comment_reports_commentId_userId_key',
        columns: ['commentId', 'userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comment_likes',
        index: 'comment_likes_commentId_idx_b5a4f615',
        columns: ['commentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comment_likes',
        index: 'comment_likes_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comment_reactions',
        index: 'comment_reactions_commentId_idx_b5a4f615',
        columns: ['commentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comment_reactions',
        index: 'comment_reactions_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comment_reports',
        index: 'comment_reports_commentId_idx_b5a4f615',
        columns: ['commentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comment_reports',
        index: 'comment_reports_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comments',
        index: 'comments_parentId_idx_6a68f597',
        columns: ['parentId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comment_likes',
        foreignKey: {
          name: 'comment_likes_commentId_fkey',
          columns: ['commentId'],
          references: { schema: 'public', table: 'comments', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comment_likes',
        foreignKey: {
          name: 'comment_likes_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comment_reactions',
        foreignKey: {
          name: 'comment_reactions_commentId_fkey',
          columns: ['commentId'],
          references: { schema: 'public', table: 'comments', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comment_reactions',
        foreignKey: {
          name: 'comment_reactions_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comment_reports',
        foreignKey: {
          name: 'comment_reports_commentId_fkey',
          columns: ['commentId'],
          references: { schema: 'public', table: 'comments', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comment_reports',
        foreignKey: {
          name: 'comment_reports_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comments',
        foreignKey: {
          name: 'comments_parentId_fkey',
          columns: ['parentId'],
          references: { schema: 'public', table: 'comments', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
