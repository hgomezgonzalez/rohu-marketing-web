import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Lead } from '@/types/lead';

/**
 * Dev-only JSON-file persistence for leads.
 * IMPORTANT: on Heroku (ephemeral dyno filesystem) this file is lost on every
 * restart. For production use, the API route also supports forwarding each lead
 * to a `LEAD_API_URL` webhook, and pushes a real-time notification to Telegram.
 * Replace with a managed DB (Postgres, Supabase) when scaling beyond v1.
 */

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, '[]', 'utf-8');
  }
}

export async function appendLead(lead: Lead): Promise<void> {
  await ensureFile();
  const raw = await fs.readFile(LEADS_FILE, 'utf-8');
  let leads: Lead[];
  try {
    leads = JSON.parse(raw);
    if (!Array.isArray(leads)) leads = [];
  } catch {
    leads = [];
  }
  leads.push(lead);
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

export async function readLeads(): Promise<Lead[]> {
  await ensureFile();
  const raw = await fs.readFile(LEADS_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
