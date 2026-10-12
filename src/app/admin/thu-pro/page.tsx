import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAdminSession } from '@/lib/admin';
import { aiEnabled } from '@/lib/ai';
import PreviewClient from './PreviewClient';
import { AI_SECTIONS } from '@/lib/aiReport';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Xem thử bản Pro', robots: { index: false } };

export default async function ProPreview() {
  if (!(await isAdminSession())) redirect('/admin');
  return <PreviewClient aiEnabled={aiEnabled() || process.env.AI_MOCK === '1'} sections={AI_SECTIONS} />;
}
