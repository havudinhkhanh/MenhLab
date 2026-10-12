/** Truy cập Supabase phía server (service role). Không bao giờ import file này vào component client. */
import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import type { BirthInput, Conventions } from './engine/birth';
import { devDb, devDbEnabled } from './devdb';
import { withTestPro } from './testAccount';

let client: SupabaseClient | null = null;

export const dbEnabled = () => !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) || devDbEnabled();

export function db(): SupabaseClient {
  if (devDbEnabled()) return devDb as unknown as SupabaseClient;
  if (!dbEnabled()) throw new Error('Chưa cấu hình SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export interface ChartRow {
  id: string;
  created_at: string;
  email: string | null;
  display_name: string | null;
  birth_input: BirthInput;
  conventions: Conventions;
  is_pro: boolean;
  pro_at: string | null;
  consent_marketing: boolean;
  consent_research: boolean;
  unsubscribed_at: string | null;
  drip_step: number;
  last_drip_at: string | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (s: string) => UUID.test(s);

export async function getChartRow(id: string): Promise<ChartRow | null> {
  if (!isUuid(id) || !dbEnabled()) return null;
  const { data, error } = await db().from('charts').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? withTestPro(data as ChartRow) : null;
}

export const hashEmail = (email: string) =>
  createHash('sha256').update(`${process.env.HASH_SALT || 'menhlab'}:${email.trim().toLowerCase()}`).digest('hex');

export const hashIp = (ip: string | null) =>
  ip ? createHash('sha256').update(`${process.env.HASH_SALT || 'menhlab'}:ip:${ip}`).digest('hex').slice(0, 32) : null;

export const isEmail = (s: unknown): s is string =>
  typeof s === 'string' && s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
