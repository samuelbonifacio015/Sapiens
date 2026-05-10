/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user?: { id: number; rol: 'USER' | 'ADMIN' };
  }
}

interface ImportMetaEnv {
  readonly DB_HOST: string;
  readonly DB_PORT: string;
  readonly DB_USER: string;
  readonly DB_PASS: string;
  readonly DB_NAME: string;
  readonly JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
