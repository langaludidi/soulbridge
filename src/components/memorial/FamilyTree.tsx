/**
 * FamilyTree Component
 * iOS 26 Liquid Glass Family Tree Section
 *
 * Features:
 * - Desktop: Visual tree layout with connecting lines
 * - Mobile: List view grouped by relationship
 * - Hover effects with scale animation
 * - Photo avatars with glass styling
 * - Supports multi-generational families
 * - Dark mode support
 */

'use client';

import Image from 'next/image';
import { Users } from 'lucide-react';
import { GlassCard } from '@/components/glass/GlassCard';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  photo?: string;
  children?: FamilyMember[];
}

interface FamilyTreeProps {
  members: {
    deceased: {
      name: string;
      photo: string;
    };
    spouse?: FamilyMember;
    children?: FamilyMember[];
    parents?: FamilyMember[];
    siblings?: FamilyMember[];
  };
  className?: string;
}

export function FamilyTree({ members, className }: FamilyTreeProps) {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  return (
    <section
      id="family"
      className={`py-20 px-6 bg-gray-50/50 dark:bg-gray-900/50 scroll-mt-32 ${className || ''}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">
              Family Tree
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Celebrating family connections
          </p>
        </motion.div>

        {/* Desktop tree view */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Parents level */}
            {members.parents && members.parents.length > 0 && (
              <div className="flex gap-8 justify-center">
                {members.parents.map((parent) => (
                  <FamilyMemberNode
                    key={parent.id}
                    member={parent}
                    isHovered={hoveredMember === parent.id}
                    onHover={setHoveredMember}
                  />
                ))}
              </div>
            )}

            {/* Main person + spouse */}
            <div className="flex gap-12 items-center justify-center relative">
              {/* Connecting line to parents */}
              {members.parents && members.parents.length > 0 && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-300 dark:bg-gray-700" />
              )}

              <FamilyMemberNode
                member={{
                  id: 'deceased',
                  name: members.deceased.name,
                  relationship: 'Deceased',
                  photo: members.deceased.photo,
                }}
                isMain
                isHovered={hoveredMember === 'deceased'}
                onHover={setHoveredMember}
              />

              {members.spouse && (
                <>
                  {/* Connecting line */}
                  <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-700" />

                  <FamilyMemberNode
                    member={members.spouse}
                    isHovered={hoveredMember === members.spouse.id}
                    onHover={setHoveredMember}
                  />
                </>
              )}
            </div>

            {/* Children level */}
            {members.children && members.children.length > 0 && (
              <>
                {/* Connecting line to children */}
                <div className="relative w-full flex justify-center">
                  <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-700" />
                </div>

                <div className="flex gap-8 justify-center flex-wrap">
                  {members.children.map((child) => (
                    <div key={child.id} className="flex flex-col items-center gap-4">
                      <FamilyMemberNode
                        member={child}
                        isHovered={hoveredMember === child.id}
                        onHover={setHoveredMember}
                      />

                      {/* Grandchildren */}
                      {child.children && child.children.length > 0 && (
                        <>
                          <div className="w-0.5 h-4 bg-gray-300 dark:bg-gray-700" />
                          <div className="flex gap-4">
                            {child.children.map((grandchild) => (
                              <FamilyMemberNode
                                key={grandchild.id}
                                member={grandchild}
                                size="sm"
                                isHovered={hoveredMember === grandchild.id}
                                onHover={setHoveredMember}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Siblings */}
            {members.siblings && members.siblings.length > 0 && (
              <div className="mt-8">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Siblings
                </p>
                <div className="flex gap-6 justify-center">
                  {members.siblings.map((sibling) => (
                    <FamilyMemberNode
                      key={sibling.id}
                      member={sibling}
                      size="sm"
                      isHovered={hoveredMember === sibling.id}
                      onHover={setHoveredMember}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Mobile list view */}
        <div className="md:hidden space-y-6">
          {/* Spouse */}
          {members.spouse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Spouse
              </h3>
              <FamilyMemberCard member={members.spouse} />
            </motion.div>
          )}

          {/* Children */}
          {members.children && members.children.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Children
              </h3>
              <div className="space-y-3">
                {members.children.map((child) => (
                  <FamilyMemberCard key={child.id} member={child} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Parents */}
          {members.parents && members.parents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Parents
              </h3>
              <div className="space-y-3">
                {members.parents.map((parent) => (
                  <FamilyMemberCard key={parent.id} member={parent} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Siblings */}
          {members.siblings && members.siblings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Siblings
              </h3>
              <div className="space-y-3">
                {members.siblings.map((sibling) => (
                  <FamilyMemberCard key={sibling.id} member={sibling} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// Family member node for tree view
function FamilyMemberNode({
  member,
  isMain = false,
  size = 'md',
  isHovered,
  onHover,
}: {
  member: FamilyMember;
  isMain?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const photoSize = isMain ? 'lg' : size;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-2 relative"
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Photo in glass frame */}
      <div
        className={`
        ${sizeClasses[photoSize]}
        rounded-full
        bg-white/80 dark:bg-gray-800/80
        backdrop-blur-md
        border-2 border-white/60 dark:border-white/20
        shadow-glass-md
        overflow-hidden
        transition-all duration-300
        relative
        ${isHovered ? 'scale-110 shadow-glass-lg' : ''}
        ${isMain ? 'ring-4 ring-blue-500/50' : ''}
      `}
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-2xl">
            {member.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name and relationship */}
      <div
        className={`text-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-70'
        }`}
      >
        <p
          className={`font-semibold text-gray-900 dark:text-white ${
            size === 'sm' ? 'text-sm' : 'text-base'
          }`}
        >
          {member.name}
        </p>
        <p
          className={`text-gray-600 dark:text-gray-400 ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          }`}
        >
          {member.relationship}
        </p>
      </div>
    </motion.div>
  );
}

// Family member card for mobile view
function FamilyMemberCard({ member }: { member: FamilyMember }) {
  return (
    <GlassCard className="p-4 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-xl">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">
          {member.name}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {member.relationship}
        </p>
      </div>
    </GlassCard>
  );
}
