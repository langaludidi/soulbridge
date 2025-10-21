'use client';

import { useState, useEffect } from 'react';

interface FamilyMember {
  id?: string;
  full_name: string;
  relationship_type: string;
  photo_url?: string;
  date_of_birth?: string;
  date_of_death?: string;
  is_living: boolean;
  description?: string;
}

interface AddFamilyMemberFormProps {
  memorialId: string;
  editingMember?: FamilyMember | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddFamilyMemberForm({
  memorialId,
  editingMember,
  onSuccess,
  onCancel,
}: AddFamilyMemberFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FamilyMember>({
    full_name: '',
    relationship_type: '',
    photo_url: '',
    date_of_birth: '',
    date_of_death: '',
    is_living: true,
    description: '',
  });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        full_name: editingMember.full_name || '',
        relationship_type: editingMember.relationship_type || '',
        photo_url: editingMember.photo_url || '',
        date_of_birth: editingMember.date_of_birth || '',
        date_of_death: editingMember.date_of_death || '',
        is_living: editingMember.is_living ?? true,
        description: editingMember.description || '',
      });
    }
  }, [editingMember]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = editingMember
        ? '/api/family-members'
        : '/api/family-members';

      const method = editingMember ? 'PATCH' : 'POST';
      const body = editingMember
        ? { id: editingMember.id, ...formData }
        : { memorial_id: memorialId, ...formData };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save family member');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const relationshipTypes = [
    { value: '', label: 'Select Relationship' },
    { value: 'mother', label: 'Mother' },
    { value: 'father', label: 'Father' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'husband', label: 'Husband' },
    { value: 'wife', label: 'Wife' },
    { value: 'partner', label: 'Partner' },
    { value: 'son', label: 'Son' },
    { value: 'daughter', label: 'Daughter' },
    { value: 'brother', label: 'Brother' },
    { value: 'sister', label: 'Sister' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'grandmother', label: 'Grandmother' },
    { value: 'grandfather', label: 'Grandfather' },
    { value: 'grandchild', label: 'Grandchild' },
    { value: 'grandson', label: 'Grandson' },
    { value: 'granddaughter', label: 'Granddaughter' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editingMember ? 'Edit Family Member' : 'Add Family Member'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Relationship Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Relationship *
              </label>
              <select
                name="relationship_type"
                required
                value={formData.relationship_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {relationshipTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Photo URL (Optional)
              </label>
              <input
                type="url"
                name="photo_url"
                value={formData.photo_url}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth (Optional)
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Living Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_living"
                name="is_living"
                checked={formData.is_living}
                onChange={handleChange}
                className="w-4 h-4 text-[#2B3E50] border-gray-300 rounded focus:ring-[#2B3E50]"
              />
              <label htmlFor="is_living" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Still Living
              </label>
            </div>

            {/* Date of Death (if not living) */}
            {!formData.is_living && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Death
                </label>
                <input
                  type="date"
                  name="date_of_death"
                  value={formData.date_of_death}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description or note about this family member..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#2B3E50] text-white px-6 py-3 rounded-lg hover:bg-[#243342] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
