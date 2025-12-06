'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase';

interface EventForm {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: string;
}

const initialFormState: EventForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  type: 'Workshop',
};

const eventTypes = ['Workshop', 'Study Jam', 'Tech Talk', 'Hackathon', 'Social', 'Other'];

export default function AdminEventsPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<EventForm>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/login?redirect=/admin/events');
    }
  }, [user, isAdmin, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('events').insert([{
        ...form,
        created_by: user?.id,
      }]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Event created successfully!' });
      setForm(initialFormState);
    } catch (err) {
      console.error('Error creating event:', err);
      setMessage({ type: 'error', text: 'Failed to create event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#0a1628' }}>
        <div style={{ fontSize: '1.25rem', color: '#9ca3af' }}>Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="w-full py-20" style={{ backgroundColor: '#0a1628' }}>
      <div style={{ maxWidth: '48rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem' }}>
            Admin: Create Event
          </h1>
          <p style={{ color: '#9ca3af' }}>Add a new event to the platform</p>
        </div>

        {message && (
          <div className="animate-fade-in-up" style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: message.type === 'success' ? '#4ade80' : '#ef4444',
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="animate-fade-in-up animation-delay-100" style={{
          backgroundColor: '#0f1d32',
          border: '1px solid rgba(107, 114, 128, 0.3)',
          borderRadius: '1rem',
          padding: '2rem',
        }}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '500' }}>
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g., Python Workshop for Beginners"
              />
            </div>

            {/* Date and Time Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Date *
                </label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Time *
                </label>
                <input type="time" name="time" value={form.time} onChange={handleChange} required className="form-input" />
              </div>
            </div>

            {/* Location and Type Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Location *
                </label>
                <input type="text" name="location" value={form.location} onChange={handleChange} required className="form-input" placeholder="e.g., Room 304 & Zoom" />
              </div>
              <div>
                <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Event Type *
                </label>
                <select name="type" value={form.type} onChange={handleChange} required className="form-input">
                  {eventTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem', fontWeight: '500' }}>
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="form-input"
                placeholder="Describe what the event is about..."
              />
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setForm(initialFormState)}
                className="btn-animated-secondary"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-animated"
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                <span className="btn-text">{isSubmitting ? 'Creating...' : 'Create Event'}</span>
                <span className="btn-ripple"></span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

