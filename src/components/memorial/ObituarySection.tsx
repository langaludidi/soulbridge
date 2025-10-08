/**
 * ObituarySection Component
 * Clean, readable obituary section with professional typography
 * Based on reference designs
 */

'use client';

interface ObituarySectionProps {
  content: string;
}

export function ObituarySection({ content }: ObituarySectionProps) {
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 md:p-10">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">
        Obituary
      </h2>

      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-gray-700 text-base md:text-lg leading-relaxed break-words">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
