'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditMemorialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [currentProfileImage, setCurrentProfileImage] = useState<string>('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [currentCoverImage, setCurrentCoverImage] = useState<string>('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    maiden_name: '',
    nickname: '',
    date_of_birth: '',
    date_of_death: '',
    place_of_birth: '',
    place_of_death: '',
    funeral_date: '',
    funeral_time: '',
    funeral_location: '',
    funeral_address: '',
    burial_location: '',
    biography: '',
    obituary: '',
    visibility: 'public' as 'public' | 'private' | 'unlisted',
    allow_tributes: true,
    allow_candles: true,
    allow_photos: true,
    status: 'published' as 'draft' | 'published',
    theme: 'classic' as 'classic' | 'modern' | 'elegant' | 'minimal' | 'warm' | 'serene',
  });

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      fetchMemorial(p.id);
    });
  }, [params]);

  const fetchMemorial = async (memorialId: string) => {
    try {
      const response = await fetch(`/api/memorials/${memorialId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch memorial');
      }

      const memorial = data.data;
      setCurrentProfileImage(memorial.profile_image_url || '');
      setCurrentCoverImage(memorial.cover_image_url || '');
      setFormData({
        first_name: memorial.first_name || '',
        last_name: memorial.last_name || '',
        maiden_name: memorial.maiden_name || '',
        nickname: memorial.nickname || '',
        date_of_birth: memorial.date_of_birth || '',
        date_of_death: memorial.date_of_death || '',
        place_of_birth: memorial.place_of_birth || '',
        place_of_death: memorial.place_of_death || '',
        funeral_date: memorial.funeral_date || '',
        funeral_time: memorial.funeral_time || '',
        funeral_location: memorial.funeral_location || '',
        funeral_address: memorial.funeral_address || '',
        burial_location: memorial.burial_location || '',
        biography: memorial.biography || '',
        obituary: memorial.obituary || '',
        visibility: memorial.visibility || 'public',
        allow_tributes: memorial.allow_tributes ?? true,
        allow_candles: memorial.allow_candles ?? true,
        allow_photos: memorial.allow_photos ?? true,
        status: memorial.status || 'published',
        theme: memorial.theme || 'classic',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      let profileImageUrl = currentProfileImage;
      let coverImageUrl = currentCoverImage;

      setUploading(true);

      // Step 1: Upload new profile image if selected
      if (profileImage) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', profileImage);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || 'Failed to upload profile image');
        }

        profileImageUrl = uploadData.url;
      }

      // Step 2: Upload new cover image if selected
      if (coverImage) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', coverImage);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || 'Failed to upload cover image');
        }

        coverImageUrl = uploadData.url;
      }

      setUploading(false);

      // Step 3: Update memorial
      const response = await fetch(`/api/memorials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          profile_image_url: profileImageUrl,
          cover_image_url: coverImageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update memorial');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/memorials/${id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this memorial? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/memorials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete memorial');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/memorials/${id}`}
            className="text-[#2B3E50] hover:text-[#243342] dark:text-[#9FB89D] text-sm mb-4 inline-flex items-center"
          >
            ← Back to Memorial
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            Edit Memorial
          </h1>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <p className="text-green-800 dark:text-green-200">Memorial updated successfully! Redirecting...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>

            {/* Profile Picture Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                {(profileImagePreview || currentProfileImage) && (
                  <img
                    src={profileImagePreview || currentProfileImage}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                  />
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleProfileImageChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Upload a new photo to replace the current one (JPEG, PNG, GIF, WebP - Max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Cover/Banner Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover/Banner Image (Optional)
              </label>
              <div className="space-y-3">
                {(coverImagePreview || currentCoverImage) && (
                  <img
                    src={coverImagePreview || currentCoverImage}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleCoverImageChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload a banner image for the memorial page header (JPEG, PNG, GIF, WebP - Max 10MB)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maiden Name
                </label>
                <input
                  type="text"
                  name="maiden_name"
                  value={formData.maiden_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Important Dates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  required
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Passing *
                </label>
                <input
                  type="date"
                  name="date_of_death"
                  required
                  value={formData.date_of_death}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Biography */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Life Story
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biography
                </label>
                <textarea
                  name="biography"
                  rows={6}
                  value={formData.biography}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Privacy & Features
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Visibility
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="public">Public - Anyone can view</option>
                  <option value="unlisted">Unlisted - Only with link</option>
                  <option value="private">Private - Only you</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Memorial Theme
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="classic">Classic - Traditional and timeless</option>
                  <option value="modern">Modern - Clean and contemporary</option>
                  <option value="elegant">Elegant - Sophisticated and refined</option>
                  <option value="minimal">Minimal - Simple and understated</option>
                  <option value="warm">Warm - Comforting and inviting</option>
                  <option value="serene">Serene - Peaceful and calming</option>
                </select>
              </div>
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allow_tributes"
                    checked={formData.allow_tributes}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Allow Tributes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allow_candles"
                    checked={formData.allow_candles}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Allow Candles</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allow_photos"
                    checked={formData.allow_photos}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Allow Photos</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.push(`/memorials/${id}`)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 px-6 py-2 bg-[#2B3E50] text-white rounded-md hover:bg-[#243342] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading Photo...' : saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Memorial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
