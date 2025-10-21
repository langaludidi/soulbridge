'use client';

import { useState, useEffect } from 'react';
import MemorialServices from './MemorialServices';
import AddMemorialServiceForm from './AddMemorialServiceForm';

interface MemorialService {
  id: string;
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

interface MemorialServicesSectionProps {
  memorialId: string;
  isOwner: boolean;
}

export default function MemorialServicesSection({ memorialId, isOwner }: MemorialServicesSectionProps) {
  const [services, setServices] = useState<MemorialService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<MemorialService | null>(null);

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/memorial-services?memorial_id=${memorialId}`);
      const data = await response.json();
      if (response.ok) {
        setServices(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching memorial services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [memorialId]);

  const handleAdd = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEdit = (service: MemorialService) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/memorial-services?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchServices();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete memorial service');
      }
    } catch (error) {
      console.error('Error deleting memorial service:', error);
      alert('Failed to delete memorial service');
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingService(null);
    await fetchServices();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Loading memorial services...
        </div>
      </div>
    );
  }

  return (
    <>
      <MemorialServices
        services={services}
        isOwner={isOwner}
        onAdd={isOwner ? handleAdd : undefined}
        onEdit={isOwner ? handleEdit : undefined}
        onDelete={isOwner ? handleDelete : undefined}
      />

      {showForm && (
        <AddMemorialServiceForm
          memorialId={memorialId}
          editingService={editingService}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </>
  );
}
