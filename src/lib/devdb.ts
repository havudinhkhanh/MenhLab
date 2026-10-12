/**
 * Cơ sở dữ liệu giả trong bộ nhớ — CHỈ để chạy thử trên máy (DEV_MEMORY_DB=1, không có SUPABASE_URL).
 * Mô phỏng phần nhỏ của supabase-js mà MệnhLab dùng: select/insert/update/upsert/delete + eq/in/gte/... + order/limit/single.
 * Dữ liệu mất khi tắt máy chủ. Không bao giờ dùng trên môi trường thật.
 */
import { randomUUID } from 'node:crypto';

type Row = Record<string, unknown>;
type Filter = (r: Row) => boolean;

const store: Record<string, Row[]> = ((globalThis as { __menhlabDevDb?: Record<string, Row[]> }).__menhlabDevDb ??= {});
const PK: Record<string, string[]> = { report_sections: ['chart_id', 'key'] };
const DEFAULTS: Record<string, () => Row> = {
  charts: () => ({ id: randomUUID(), created_at: new Date().toISOString(), is_pro: false, pro_at: null, drip_step: 0, unsubscribed_at: null, last_drip_at: null, consent_marketing: false, consent_research: false }),
  login_codes: () => ({ id: randomUUID(), created_at: new Date().toISOString(), attempts: 0, used_at: null }),
};

class Query implements PromiseLike<{ data: unknown; error: null; count?: number }> {
  private filters: Filter[] = [];
  private op: 'select' | 'insert' | 'update' | 'upsert' | 'delete' = 'select';
  private payload: Row[] = [];
  private patch: Row = {};
  private orderBy?: { col: string; asc: boolean };
  private max?: number;
  private one: 'single' | 'maybe' | null = null;
  private wantCount = false;
  private head = false;
  private returning = false;
  constructor(private table: string) {
    store[table] ??= [];
  }
  select(_cols?: string, opts?: { count?: string; head?: boolean }) {
    if (this.op === 'select') {
      this.wantCount = !!opts?.count;
      this.head = !!opts?.head;
    } else this.returning = true;
    return this;
  }
  insert(v: Row | Row[]) {
    this.op = 'insert';
    this.payload = Array.isArray(v) ? v : [v];
    return this;
  }
  upsert(v: Row | Row[]) {
    this.op = 'upsert';
    this.payload = Array.isArray(v) ? v : [v];
    return this;
  }
  update(v: Row) {
    this.op = 'update';
    this.patch = v;
    return this;
  }
  delete() {
    this.op = 'delete';
    return this;
  }
  eq(c: string, v: unknown) {
    this.filters.push((r) => r[c] === v);
    return this;
  }
  neq(c: string, v: unknown) {
    this.filters.push((r) => r[c] !== v);
    return this;
  }
  is(c: string, v: unknown) {
    this.filters.push((r) => (r[c] ?? null) === v);
    return this;
  }
  in(c: string, vs: unknown[]) {
    this.filters.push((r) => vs.includes(r[c]));
    return this;
  }
  gte(c: string, v: string | number) {
    this.filters.push((r) => (r[c] as string | number) >= v);
    return this;
  }
  gt(c: string, v: string | number) {
    this.filters.push((r) => (r[c] as string | number) > v);
    return this;
  }
  lte(c: string, v: string | number) {
    this.filters.push((r) => (r[c] as string | number) <= v);
    return this;
  }
  lt(c: string, v: string | number) {
    this.filters.push((r) => (r[c] as string | number) < v);
    return this;
  }
  not(c: string, op: string, v: unknown) {
    this.filters.push((r) => !(op === 'is' ? (r[c] ?? null) === v : r[c] === v));
    return this;
  }
  order(col: string, o?: { ascending?: boolean }) {
    this.orderBy = { col, asc: o?.ascending !== false };
    return this;
  }
  limit(n: number) {
    this.max = n;
    return this;
  }
  single() {
    this.one = 'single';
    return this;
  }
  maybeSingle() {
    this.one = 'maybe';
    return this;
  }
  private run(): { data: unknown; error: null; count?: number } {
    const rows = store[this.table];
    const match = (r: Row) => this.filters.every((f) => f(r));
    let out: Row[] = [];
    if (this.op === 'insert' || this.op === 'upsert') {
      for (const p of this.payload) {
        const keys = PK[this.table] ?? ['id'];
        const existing = this.op === 'upsert' ? rows.find((r) => keys.every((k) => p[k] !== undefined && r[k] === p[k])) : undefined;
        if (existing) {
          Object.assign(existing, p);
          out.push(existing);
        } else {
          const row = { ...(DEFAULTS[this.table]?.() ?? { id: randomUUID(), created_at: new Date().toISOString() }), ...p };
          rows.push(row);
          out.push(row);
        }
      }
      if (!this.returning) return { data: null, error: null };
    } else if (this.op === 'update') {
      out = rows.filter(match);
      out.forEach((r) => Object.assign(r, this.patch));
      if (!this.returning) return { data: null, error: null };
    } else if (this.op === 'delete') {
      const keep = rows.filter((r) => !match(r));
      out = rows.filter(match);
      store[this.table] = keep;
      return { data: null, error: null };
    } else {
      out = rows.filter(match);
    }
    if (this.orderBy) {
      const { col, asc } = this.orderBy;
      out = [...out].sort((a, b) => ((a[col] as string) > (b[col] as string) ? 1 : -1) * (asc ? 1 : -1));
    }
    const count = out.length;
    if (this.max !== undefined) out = out.slice(0, this.max);
    const copy = out.map((r) => structuredClone(r));
    if (this.head) return { data: null, error: null, count };
    if (this.one) return { data: copy[0] ?? null, error: null };
    return { data: copy, error: null, ...(this.wantCount ? { count } : {}) };
  }
  then<A = { data: unknown; error: null; count?: number }, B = never>(
    ok?: ((v: { data: unknown; error: null; count?: number }) => A | PromiseLike<A>) | null,
    fail?: ((e: unknown) => B | PromiseLike<B>) | null,
  ): PromiseLike<A | B> {
    return Promise.resolve()
      .then(() => this.run())
      .then(ok, fail);
  }
}

export const devDb = { from: (t: string) => new Query(t) };
export const devDbEnabled = () => process.env.DEV_MEMORY_DB === '1' && !process.env.SUPABASE_URL;
