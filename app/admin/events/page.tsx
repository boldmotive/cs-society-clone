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
        <div className="text-base sm:text-lg md:text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="w-full py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            Admin: Create Event
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Add a new event to the platform</p>
        </div>

        {message && (
          <div className={`animate-fade-in-up p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="animate-fade-in-up animation-delay-100 bg-[#0f1d32] border border-gray-600/30 rounded-xl p-4 sm:p-6 md:p-8">
          <div className="grid gap-4 sm:gap-5 md:gap-6">
            {/* Title */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">
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

            {/* Date and Time Row - stacks on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">
                  Date *
                </label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">
                  Time *
                </label>
                <input type="time" name="time" value={form.time} onChange={handleChange} required className="form-input" />
              </div>
            </div>

            {/* Location and Type Row - stacks on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">
                  Location *
                </label>
                <input type="text" name="location" value={form.location} onChange={handleChange} required className="form-input" placeholder="e.g., Room 304 & Zoom" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">
                  Event Type *
                </label>
                <select name="type" value={form.type} onChange={handleChange} required className="form-input">
                  {eventTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium text-sm sm:text-base">
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

            {/* Submit Button - full width on mobile */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end mt-2 sm:mt-4">
              <button
                type="button"
                onClick={() => setForm(initialFormState)}
                className="btn-animated-secondary w-full sm:w-auto"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-animated w-full sm:w-auto"
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

