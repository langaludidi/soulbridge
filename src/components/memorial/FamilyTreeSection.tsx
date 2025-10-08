/**
 * FamilyTreeSection Component
 * Visual family tree with relationships
 * Clean, professional design
 */

'use client';

import Image from 'next/image';
import type { FamilyMember } from '@/types/memorial';

interface FamilyTreeSectionProps {
  members: FamilyMember[];
}

export function FamilyTreeSection({ members }: FamilyTreeSectionProps) {
  if (!members || members.length === 0) return null;

  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">
        Family Tree
      </h2>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <div className="flex flex-wrap justify-center gap-6">
          {members.map((member) => (
            <div key={member.id} className="text-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2 mx-auto border-2 border-gray-200">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-xl">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="font-medium text-gray-900 text-sm">
                {member.name}
              </p>
              <p className="text-xs text-gray-500">
                {member.relationship}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
