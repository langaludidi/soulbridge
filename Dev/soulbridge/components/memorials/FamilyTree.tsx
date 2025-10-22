'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FamilyMember {
  id: string;
  full_name: string;
  relationship_type: string;
  photo_url?: string;
  date_of_birth?: string;
  date_of_death?: string;
  is_living: boolean;
  description?: string;
}

interface FamilyTreeProps {
  familyMembers: FamilyMember[];
  isOwner?: boolean;
  onAdd?: () => void;
  onEdit?: (member: FamilyMember) => void;
  onDelete?: (id: string) => void;
}

export default function FamilyTree({
  familyMembers,
  isOwner = false,
  onAdd,
  onEdit,
  onDelete,
}: FamilyTreeProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['parent', 'spouse', 'child'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Group family members by relationship type
  const groupedMembers = familyMembers.reduce((acc, member) => {
    const type = member.relationship_type.toLowerCase();
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(member);
    return acc;
  }, {} as Record<string, FamilyMember[]>);

  // Define sections in order with colors
  const sections = [
    {
      key: 'great-grandparent',
      title: 'Great-Grandparents',
      icon: '👴👵',
      color: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
      headerColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      key: 'grandparent',
      title: 'Grandparents',
      icon: '👴👵',
      aliases: ['grandmother', 'grandfather'],
      color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
      headerColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      key: 'parent',
      title: 'Parents',
      icon: '👨👩',
      aliases: ['mother', 'father'],
      color: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20',
      headerColor: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    {
      key: 'aunt',
      title: 'Aunts & Uncles',
      icon: '👨‍👩‍👧‍👦',
      aliases: ['uncle'],
      color: 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20',
      headerColor: 'bg-teal-100 dark:bg-teal-900/30'
    },
    {
      key: 'spouse',
      title: 'Spouse',
      icon: '💑',
      aliases: ['husband', 'wife', 'partner'],
      color: 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20',
      headerColor: 'bg-rose-100 dark:bg-rose-900/30'
    },
    {
      key: 'sibling',
      title: 'Siblings',
      icon: '👫',
      aliases: ['brother', 'sister'],
      color: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20',
      headerColor: 'bg-amber-100 dark:bg-amber-900/30'
    },
    {
      key: 'child',
      title: 'Children',
      icon: '👶',
      aliases: ['son', 'daughter'],
      color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
      headerColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      key: 'niece',
      title: 'Nieces & Nephews',
      icon: '👧👦',
      aliases: ['nephew'],
      color: 'border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-900/20',
      headerColor: 'bg-cyan-100 dark:bg-cyan-900/30'
    },
    {
      key: 'grandchild',
      title: 'Grandchildren',
      icon: '👼',
      aliases: ['grandson', 'granddaughter'],
      color: 'border-lime-200 dark:border-lime-800 bg-lime-50 dark:bg-lime-900/20',
      headerColor: 'bg-lime-100 dark:bg-lime-900/30'
    },
    {
      key: 'great-grandchild',
      title: 'Great-Grandchildren',
      icon: '👶',
      color: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20',
      headerColor: 'bg-emerald-100 dark:bg-emerald-900/30'
    },
    {
      key: 'cousin',
      title: 'Cousins',
      icon: '👥',
      color: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20',
      headerColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getMembersForSection = (section: {
    key: string;
    aliases?: string[];
    title: string;
    icon: string;
    color: string;
    headerColor: string;
  }) => {
    const keys = [section.key, ...(section.aliases || [])];
    const members: FamilyMember[] = [];
    keys.forEach(key => {
      if (groupedMembers[key]) {
        members.push(...groupedMembers[key]);
      }
    });
    return members;
  };

  if (familyMembers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p className="mb-4">No family members added yet.</p>
          {isOwner && onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex items-center px-4 py-2 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Family Member
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Family Tree
        </h2>
        {isOwner && onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center px-3 py-2 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </button>
        )}
      </div>

      <div className="space-y-4">
        {sections.map(section => {
          const members = getMembersForSection(section);
          if (members.length === 0) return null;

          const isExpanded = expandedSections.has(section.key);

          return (
            <div
              key={section.key}
              className={`border-2 rounded-lg overflow-hidden ${section.color}`}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.key)}
                className={`w-full flex items-center justify-between p-4 ${section.headerColor} hover:opacity-90 transition-all`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({members.length})
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                    isExpanded ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="p-4 space-y-3">
                  {members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      {/* Photo */}
                      {member.photo_url ? (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
                          <Image
                            src={member.photo_url}
                            alt={member.full_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-2xl">👤</span>
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {member.full_name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {member.relationship_type}
                        </p>

                        {/* Dates */}
                        {(member.date_of_birth || member.date_of_death) && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {member.date_of_birth && formatDate(member.date_of_birth)}
                            {member.date_of_birth && member.date_of_death && ' - '}
                            {member.date_of_death && formatDate(member.date_of_death)}
                            {member.is_living && member.date_of_birth && ' (Living)'}
                          </p>
                        )}

                        {/* Description */}
                        {member.description && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                            {member.description}
                          </p>
                        )}
                      </div>

                      {/* Actions (Owner Only) */}
                      {isOwner && (onEdit || onDelete) && (
                        <div className="flex gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(member)}
                              className="p-2 text-gray-600 hover:text-[#2B3E50] dark:text-gray-400 dark:hover:text-[#9FB89D]"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove ${member.full_name} from the family tree?`)) {
                                  onDelete(member.id);
                                }
                              }}
                              className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
