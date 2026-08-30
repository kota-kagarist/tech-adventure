import javascript from './javascript.json';
import typescript from './typescript.json';
import react from './react.json';
import vue from './vue.json';
import svelte from './svelte.json';
import astro from './astro.json';
import nextjs from './nextjs.json';
import nuxt from './nuxt.json';
import sveltekit from './sveltekit.json';
import hono from './hono.json';
import express from './express.json';
import fastify from './fastify.json';
import nodejs from './nodejs.json';
import bun from './bun.json';
import deno from './deno.json';
import cloudflare_workers from './cloudflare-workers.json';
import vite from './vite.json';
import postgresql from './postgresql.json';
import sqlite from './sqlite.json';
import cloudflare_d1 from './cloudflare-d1.json';
import cloudflare_r2 from './cloudflare-r2.json';
import cloudflare_kv from './cloudflare-kv.json';

import type { Technology } from '../schema';

export const technologies = [javascript, typescript, react, vue, svelte, astro, nextjs, nuxt, sveltekit, hono, express, fastify, nodejs, bun, deno, cloudflare_workers, vite, postgresql, sqlite, cloudflare_d1, cloudflare_r2, cloudflare_kv] as Technology[];
