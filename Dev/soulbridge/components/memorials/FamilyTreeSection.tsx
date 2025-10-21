'use client';

import { useState, useEffect } from 'react';
import FamilyTree from './FamilyTree';
import AddFamilyMemberForm from './AddFamilyMemberForm';

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

interface FamilyTreeSectionProps {
  memorialId: string;
  isOwner: boolean;
}

export default function FamilyTreeSection({ memorialId, isOwner }: FamilyTreeSectionProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  const fetchFamilyMembers = async () => {
    try {
      const response = await fetch(`/api/family-members?memorial_id=${memorialId}`);
      const data = await response.json();
      if (response.ok) {
        setFamilyMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, [memorialId]);

  const handleAdd = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/family-members?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchFamilyMembers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete family member');
      }
    } catch (error) {
      console.error('Error deleting family member:', error);
      alert('Failed to delete family member');
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingMember(null);
    await fetchFamilyMembers();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Loading family tree...
        </div>
      </div>
    );
  }

  return (
    <>
      <FamilyTree
        familyMembers={familyMembers}
        isOwner={isOwner}
        onAdd={isOwner ? handleAdd : undefined}
        onEdit={isOwner ? handleEdit : undefined}
        onDelete={isOwner ? handleDelete : undefined}
      />

      {showForm && (
        <AddFamilyMemberForm
          memorialId={memorialId}
          editingMember={editingMember}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </>
  );
}
