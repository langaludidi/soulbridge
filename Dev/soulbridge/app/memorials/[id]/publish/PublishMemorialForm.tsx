'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Visibility = 'public' | 'unlisted' | 'private';
type MemorialDetails = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  date_of_death: string;
  visibility: string;
  status: string;
  profile_image_url: string | null;
  obituary: string | null;
};

const options: { value: Visibility; title: string; description: string }[] = [
  { value: 'private', title: 'Private', description: 'Only your family account can view it. Do not share the link.' },
  { value: 'unlisted', title: 'Unlisted', description: 'Anyone with the link can view it, but it is excluded from public discovery and search indexing.' },
  { value: 'public', title: 'Public', description: 'Anyone can view the memorial. It may appear in search engines and Soulbridge discovery.' },
];

export default function PublishMemorialForm({ memorial }: { memorial: MemorialDetails }) {
  const router = useRouter();
  const [visibility, setVisibility] = useState<Visibility>(
    ['public', 'unlisted', 'private'].includes(memorial.visibility) ? memorial.visibility as Visibility : 'private'
  );
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handlePublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/memorials/${encodeURIComponent(memorial.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published', visibility, publication_confirmed: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update publication');
      router.push(`/memorials/${memorial.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please try again');
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-4 py-8 text-[#2B3E50] sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href={`/memorials/${memorial.id}`} className="text-sm underline underline-offset-4">
          ← Back to memorial preview
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[.16em] text-[#6a8668]">Family review</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Review and publish</h1>
        <p className="mt-3 max-w-xl leading-7 text-[#52616a]">
          Decide who can see this remembrance. You can always return to change its visibility later.
        </p>

        <section aria-label="Memorial being published" className="mt-8 rounded-xl border border-[#dce2d8] bg-white p-5 sm:p-8">
          <p className="text-xs uppercase tracking-[.12em] text-[#6a8668]">Memorial</p>
          <h2 className="mt-2 text-2xl font-medium">{memorial.first_name} {memorial.last_name}</h2>
          <p className="mt-1 text-sm text-[#647079]">{memorial.date_of_birth} — {memorial.date_of_death}</p>
          <p className="mt-4 text-sm leading-6 text-[#52616a]">
            Review the dates, name, life story, service information and any photographs before sharing.
            For social sharing, use only a photograph approved by the family.
          </p>
          <Link href={`/memorials/${memorial.id}/edit`} className="mt-4 inline-flex rounded-md border border-[#aebfaf] px-4 py-2 text-sm font-medium hover:bg-[#f5f7f5]">
            Edit memorial details
          </Link>
        </section>

        <form onSubmit={handlePublish} className="mt-6 rounded-xl border border-[#dce2d8] bg-white p-5 sm:p-8">
          <fieldset>
            <legend className="text-xl font-semibold">Who may view this memorial?</legend>
            <div className="mt-5 space-y-3">
              {options.map(option => (
                <label key={option.value} className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${visibility === option.value ? 'border-[#6a8668] bg-[#f5f7f5]' : 'border-[#e2e5df]'}`}>
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={visibility === option.value}
                    onChange={() => setVisibility(option.value)}
                    className="mt-1 accent-[#2B3E50]"
                  />
                  <span>
                    <strong className="block text-sm">{option.title}</strong>
                    <span className="mt-1 block text-sm leading-6 text-[#52616a]">{option.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="mt-6 flex items-start gap-3 rounded-lg bg-[#f8f7f3] p-4 text-sm leading-6">
            <input
              type="checkbox"
              className="mt-1 accent-[#2B3E50]"
              checked={confirmed}
              onChange={event => setConfirmed(event.target.checked)}
              required
            />
            <span>I have reviewed the memorial and have the family’s permission to publish and share the information and photographs provided.</span>
          </label>
          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href={`/memorials/${memorial.id}`} className="inline-flex justify-center px-5 py-3 text-sm font-medium underline">Keep as draft</Link>
            <button
              type="submit"
              disabled={!confirmed || busy}
              className="rounded-lg bg-[#2B3E50] px-6 py-3 text-sm font-semibold text-white hover:bg-[#243342] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Publishing…' : memorial.status === 'published' ? 'Save visibility settings' : 'Publish memorial'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
