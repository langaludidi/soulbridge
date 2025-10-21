'use client';

import { useState, useEffect } from 'react';

interface MemorialService {
  id?: string;
  service_type: string;
  title?: string;
  service_date: string;
  service_time?: string;
  location_name?: string;
  address?: string;
  city?: string;
  state_province?: string;
  country?: string;
  details?: string;
  virtual_link?: string;
  requires_rsvp?: boolean;
  max_attendees?: number;
  is_private?: boolean;
}

interface AddMemorialServiceFormProps {
  memorialId: string;
  editingService?: MemorialService | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddMemorialServiceForm({
  memorialId,
  editingService,
  onSuccess,
  onCancel,
}: AddMemorialServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<MemorialService>({
    service_type: '',
    title: '',
    service_date: '',
    service_time: '',
    location_name: '',
    address: '',
    city: '',
    state_province: '',
    country: '',
    details: '',
    virtual_link: '',
    requires_rsvp: false,
    max_attendees: undefined,
    is_private: false,
  });

  useEffect(() => {
    if (editingService) {
      setFormData({
        service_type: editingService.service_type || '',
        title: editingService.title || '',
        service_date: editingService.service_date || '',
        service_time: editingService.service_time || '',
        location_name: editingService.location_name || '',
        address: editingService.address || '',
        city: editingService.city || '',
        state_province: editingService.state_province || '',
        country: editingService.country || '',
        details: editingService.details || '',
        virtual_link: editingService.virtual_link || '',
        requires_rsvp: editingService.requires_rsvp || false,
        max_attendees: editingService.max_attendees,
        is_private: editingService.is_private || false,
      });
    }
  }, [editingService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value ? parseInt(value) : undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const method = editingService ? 'PATCH' : 'POST';
      const body = editingService
        ? { id: editingService.id, ...formData }
        : { memorial_id: memorialId, ...formData };

      const response = await fetch('/api/memorial-services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save memorial service');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const serviceTypes = [
    { value: '', label: 'Select Service Type' },
    { value: 'funeral', label: 'Funeral Service' },
    { value: 'memorial_service', label: 'Memorial Service' },
    { value: 'celebration_of_life', label: 'Celebration of Life' },
    { value: 'visitation', label: 'Visitation/Viewing' },
    { value: 'unveiling', label: 'Unveiling Ceremony' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editingService ? 'Edit Memorial Service' : 'Add Memorial Service'}
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
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Type *
              </label>
              <select
                name="service_type"
                required
                value={formData.service_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {serviceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Title (Optional)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., 'A Celebration of Jane's Life'"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="service_date"
                  required
                  value={formData.service_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time (Optional)
                </label>
                <input
                  type="time"
                  name="service_time"
                  value={formData.service_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Location Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location Name (Optional)
              </label>
              <input
                type="text"
                name="location_name"
                value={formData.location_name}
                onChange={handleChange}
                placeholder="e.g., 'St. Mary's Church' or 'Family Home'"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Street Address (Optional)
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* City, State, Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City (Optional)
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State/Province (Optional)
                </label>
                <input
                  type="text"
                  name="state_province"
                  value={formData.state_province}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country (Optional)
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Virtual Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Virtual Link (Optional)
              </label>
              <input
                type="url"
                name="virtual_link"
                value={formData.virtual_link}
                onChange={handleChange}
                placeholder="https://zoom.us/... or YouTube link"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                For virtual attendance (Zoom, YouTube, etc.)
              </p>
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                name="details"
                rows={4}
                value={formData.details}
                onChange={handleChange}
                placeholder="Additional information about the service (dress code, parking, reception details, etc.)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* RSVP and Attendance Options */}
            <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requires_rsvp"
                  name="requires_rsvp"
                  checked={formData.requires_rsvp}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#2B3E50] border-gray-300 rounded focus:ring-[#2B3E50]"
                />
                <label htmlFor="requires_rsvp" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Requires RSVP
                </label>
              </div>

              {formData.requires_rsvp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Attendees (Optional)
                  </label>
                  <input
                    type="number"
                    name="max_attendees"
                    min="1"
                    value={formData.max_attendees || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_private"
                  name="is_private"
                  checked={formData.is_private}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#2B3E50] border-gray-300 rounded focus:ring-[#2B3E50]"
                />
                <label htmlFor="is_private" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Private Service (only visible to you)
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#2B3E50] text-white px-6 py-3 rounded-lg hover:bg-[#243342] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
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
