'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ITEM_TYPE_PRESETS = [
  { value: 'opening_prayer', label: 'Opening Prayer', icon: '🙏' },
  { value: 'hymn', label: 'Hymn', icon: '🎵' },
  { value: 'scripture', label: 'Scripture Reading', icon: '📖' },
  { value: 'tribute', label: 'Tribute', icon: '💐' },
  { value: 'eulogy', label: 'Eulogy', icon: '📝' },
  { value: 'poem', label: 'Poem', icon: '✍️' },
  { value: 'musical_selection', label: 'Musical Selection', icon: '🎶' },
  { value: 'reflection', label: 'Reflection', icon: '🕊️' },
  { value: 'closing_prayer', label: 'Closing Prayer', icon: '🙏' },
  { value: 'benediction', label: 'Benediction', icon: '✨' },
  { value: 'committal', label: 'Committal', icon: '⚱️' },
  { value: 'custom', label: 'Custom', icon: '➕' },
];

const THEME_COLORS = [
  { value: 'classic', label: 'Classic (Gold & Black)', colors: 'bg-black text-yellow-600' },
  { value: 'modern', label: 'Modern (Navy & Silver)', colors: 'bg-blue-900 text-gray-300' },
  { value: 'traditional', label: 'Traditional (Brown & Cream)', colors: 'bg-amber-900 text-amber-100' },
  { value: 'ubuntu', label: 'Ubuntu (Orange & White)', colors: 'bg-orange-600 text-white' },
];

function SortableItem({
  item,
  onDelete,
}: {
  item: any;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>
      <div className="text-2xl">
        {ITEM_TYPE_PRESETS.find(p => p.value === item.item_type)?.icon || '📄'}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900 dark:text-white">
          {item.title}
        </div>
        {item.speaker_performer && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {item.speaker_performer}
          </div>
        )}
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="text-red-600 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
}

export default function OrderOfServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [memorial, setMemorial] = useState<any>(null);
  const [oos, setOos] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    cover_title: 'In Loving Memory',
    theme_color: 'classic',
    officiant: '',
    venue: '',
    service_date: '',
    service_time: '',
    pallbearers: [''],
  });

  const [newItem, setNewItem] = useState({
    item_type: 'opening_prayer',
    title: '',
    speaker_performer: '',
    duration: '',
    notes: '',
  });

  const [showAddItem, setShowAddItem] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [reviewLink, setReviewLink] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      fetchData(p.id);
    });
  }, [params]);

  const fetchData = async (memorialId: string) => {
    try {
      // Fetch memorial
      const memorialRes = await fetch(`/api/memorials/${memorialId}`);
      const memorialData = await memorialRes.json();

      if (memorialRes.ok) {
        setMemorial(memorialData.data);

        // Auto-prefill from memorial
        setFormData(prev => ({
          ...prev,
          venue: memorialData.data.funeral_location || '',
          service_date: memorialData.data.funeral_date || '',
        }));
      }

      // Fetch order of service
      const oosRes = await fetch(`/api/order-of-service?memorial_id=${memorialId}`);
      const oosData = await oosRes.json();

      if (oosRes.ok && oosData.data) {
        setOos(oosData.data);
        setItems(oosData.data.items || []);
        setFormData({
          cover_title: oosData.data.cover_title || 'In Loving Memory',
          theme_color: oosData.data.theme_color || 'classic',
          officiant: oosData.data.officiant || '',
          venue: oosData.data.venue || memorialData.data?.funeral_location || '',
          service_date: oosData.data.service_date || memorialData.data?.funeral_date || '',
          service_time: oosData.data.service_time || '',
          pallbearers: oosData.data.pallbearers || [''],
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      if (!oos) {
        // Create new order of service
        const response = await fetch('/api/order-of-service', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memorial_id: id,
            ...formData,
            items: items,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create order of service');
        }

        setOos(data.data);
      } else {
        // Update existing
        const response = await fetch('/api/order-of-service', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: oos.id,
            ...formData,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update order of service');
        }

        setOos(data.data);
      }

      alert('Saved successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!oos) {
      alert('Please save the order of service first');
      return;
    }

    try {
      const response = await fetch('/api/order-of-service/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_of_service_id: oos.id,
          ...newItem,
          duration: newItem.duration ? parseInt(newItem.duration) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item');
      }

      setItems([...items, data.data]);
      setNewItem({
        item_type: 'opening_prayer',
        title: '',
        speaker_performer: '',
        duration: '',
        notes: '',
      });
      setShowAddItem(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Delete this item?')) return;

    try {
      const response = await fetch(`/api/order-of-service/items?id=${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setItems(items.filter(item => item.id !== itemId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const addPallbearer = () => {
    setFormData(prev => ({
      ...prev,
      pallbearers: [...prev.pallbearers, ''],
    }));
  };

  const updatePallbearer = (index: number, value: string) => {
    const newPallbearers = [...formData.pallbearers];
    newPallbearers[index] = value;
    setFormData(prev => ({ ...prev, pallbearers: newPallbearers }));
  };

  const removePallbearer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pallbearers: prev.pallbearers.filter((_, i) => i !== index),
    }));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Update the order in the backend
    try {
      for (let i = 0; i < newItems.length; i++) {
        await fetch('/api/order-of-service/items', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newItems[i].id,
            item_order: i,
          }),
        });
      }
    } catch (err) {
      console.error('Error updating item order:', err);
      alert('Failed to save new order');
      // Revert on error
      fetchData(id);
    }
  };

  const handleGenerateReviewLink = async () => {
    if (!oos) {
      alert('Please save the order of service first');
      return;
    }

    setGeneratingLink(true);

    try {
      const response = await fetch('/api/order-of-service/review-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_of_service_id: oos.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate review link');
      }

      setReviewLink(data.data.review_url);

      // Copy to clipboard
      navigator.clipboard.writeText(data.data.review_url);
      alert('Review link generated and copied to clipboard!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGeneratingLink(false);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/memorials/${id}`}
            className="text-[#2B3E50] hover:text-[#243342] dark:text-[#9FB89D] text-sm mb-4 inline-flex items-center"
          >
            ← Back to Memorial
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            Order of Service
          </h1>
          {memorial && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {memorial.full_name}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Cover & Service Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Cover & Service Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Title
              </label>
              <input
                type="text"
                value={formData.cover_title}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme Color
              </label>
              <select
                value={formData.theme_color}
                onChange={(e) => setFormData(prev => ({ ...prev, theme_color: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {THEME_COLORS.map(theme => (
                  <option key={theme.value} value={theme.value}>{theme.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Officiant
              </label>
              <input
                type="text"
                value={formData.officiant}
                onChange={(e) => setFormData(prev => ({ ...prev, officiant: e.target.value }))}
                placeholder="Rev. John Smith"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Venue
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                placeholder="St. Mary's Church"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Date
              </label>
              <input
                type="date"
                value={formData.service_date}
                onChange={(e) => setFormData(prev => ({ ...prev, service_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Time
              </label>
              <input
                type="time"
                value={formData.service_time}
                onChange={(e) => setFormData(prev => ({ ...prev, service_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pallbearers
            </label>
            {formData.pallbearers.map((pallbearer, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={pallbearer}
                  onChange={(e) => updatePallbearer(index, e.target.value)}
                  placeholder={`Pallbearer ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => removePallbearer(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addPallbearer}
              className="text-sm text-[#2B3E50] hover:text-[#243342] dark:text-[#9FB89D]"
            >
              + Add Pallbearer
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#2B3E50] text-white rounded-md hover:bg-[#243342] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Details'}
            </button>
            {oos && (
              <>
                <Link
                  href={`/memorials/${id}/order-of-service/preview`}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Preview & Print
                </Link>
                <button
                  onClick={handleGenerateReviewLink}
                  disabled={generatingLink}
                  className="px-6 py-2 bg-[#9FB89D] text-white rounded-md hover:bg-[#84a182] disabled:opacity-50"
                >
                  {generatingLink ? 'Generating...' : 'Generate Review Link'}
                </button>
              </>
            )}
          </div>

          {/* Review Link Display */}
          {oos && (reviewLink || oos.review_token) && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Review Link {oos.review_approved && '(Approved ✓)'}
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={reviewLink || `${window.location.origin}/memorials/${id}/order-of-service/review/${oos.review_token}`}
                  className="flex-1 px-3 py-2 text-sm border border-[#bac9b7] dark:border-[#556d53] rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => {
                    const link = reviewLink || `${window.location.origin}/memorials/${id}/order-of-service/review/${oos.review_token}`;
                    navigator.clipboard.writeText(link);
                    alert('Copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-[#9FB89D] text-white rounded-md hover:bg-[#84a182] text-sm"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-[#556d53] dark:text-[#bac9b7] mt-2">
                Share this link with family members to review and approve the order of service.
                {oos.review_expires_at && (
                  <span className="block mt-1">
                    Expires: {new Date(oos.review_expires_at).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Program Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Program Items
            {items.length > 0 && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                (Drag to reorder)
              </span>
            )}
          </h2>

          {items.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 mb-4">No items added yet</p>
          )}

          {!showAddItem ? (
            <button
              onClick={() => setShowAddItem(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-[#2B3E50]"
            >
              + Add Item
            </button>
          ) : (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newItem.item_type}
                  onChange={(e) => setNewItem(prev => ({ ...prev, item_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {ITEM_TYPE_PRESETS.map(preset => (
                    <option key={preset.value} value={preset.value}>
                      {preset.icon} {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Amazing Grace"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Speaker/Performer
                </label>
                <input
                  type="text"
                  value={newItem.speaker_performer}
                  onChange={(e) => setNewItem(prev => ({ ...prev, speaker_performer: e.target.value }))}
                  placeholder="e.g., John Smith"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddItem(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-[#2B3E50] text-white rounded-md hover:bg-[#243342]"
                >
                  Add Item
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
