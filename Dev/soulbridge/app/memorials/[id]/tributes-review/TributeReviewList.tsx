'use client';

import { useEffect, useState } from 'react';

type Tribute = {
  id: string;
  author_name: string;
  author_relationship: string | null;
  message: string;
  created_at: string;
};

export default function TributeReviewList({ memorialId }: { memorialId: string }) {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState('');

  const endpoint = `/api/memorials/${encodeURIComponent(memorialId)}/moderate-tributes`;

  useEffect(() => {
    let active = true;
    fetch(endpoint, { cache: 'no-store' })
      .then(async response => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Could not load tributes');
        if (active) setTributes(body.data || []);
      })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Could not load tributes'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [endpoint]);

  async function moderate(id: string, action: 'approve' | 'reject') {
    if (working) return;
    if (action === 'reject' && !window.confirm('Permanently remove this submitted tribute?')) return;
    setWorking(id);
    setError('');
    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tribute_id: id, action }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to review tribute');
      setTributes(current => current.filter(t => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please retry');
    } finally {
      setWorking(null);
    }
  }

  return (
    <section className="mt-8" aria-live="polite">
      {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {loading ? <p>Loading submitted tributes…</p> :
       tributes.length === 0 ? (
        <div className="rounded-xl border border-[#dce2d8] bg-white p-8 text-sm">No tributes are waiting for approval.</div>
       ) : (
        <ul className="space-y-4">
          {tributes.map(tribute => (
            <li key={tribute.id} className="rounded-xl border border-[#dce2d8] bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">{tribute.author_name}</h2>
                <span className="text-xs text-[#647079]">{new Date(tribute.created_at).toLocaleDateString('en-ZA')}</span>
              </div>
              {tribute.author_relationship && <p className="mt-1 text-sm text-[#647079]">{tribute.author_relationship}</p>}
              <p className="mt-4 whitespace-pre-wrap break-words leading-7">{tribute.message}</p>
              <div className="mt-5 flex flex-wrap gap-3 border-t border-[#e6e9e3] pt-4">
                <button
                  type="button"
                  disabled={!!working}
                  onClick={() => moderate(tribute.id, 'approve')}
                  className="rounded-lg bg-[#2B3E50] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                >Approve</button>
                <button
                  type="button"
                  disabled={!!working}
                  onClick={() => moderate(tribute.id, 'reject')}
                  className="rounded-lg border border-[#bdc7bc] px-5 py-2.5 text-sm font-medium disabled:opacity-50"
                >Remove</button>
              </div>
            </li>
          ))}
        </ul>
       )}
    </section>
  );
}
