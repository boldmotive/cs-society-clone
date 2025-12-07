'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        setEvents(getMockEvents());
      } else {
        setEvents(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setEvents(getMockEvents());
    } finally {
      setLoading(false);
    }
  }

  function getMockEvents(): Event[] {
    return [
      {
        id: 1,
        title: 'Python for Absolute Beginners',
        date: '2025-12-05',
        time: '08:47 PM',
        location: 'Room 304 & Zoom',
        description: 'Never written a line of code? This workshop is for you. We\'ll cover variables, loops, and make a text adventure game.',
        type: 'Workshop'
      },
      {
        id: 2,
        title: 'Study Jam: Finals Prep',
        date: '2025-12-11',
        time: '08:47 PM',
        location: 'Student Center Lounge',
        description: 'Bring your coffee and your questions. A chill session to study together with lo-fi beats and snacks.',
        type: 'Study Jam'
      },
      {
        id: 3,
        title: 'Tech Talk: Life After Graduation',
        date: '2026-01-03',
        time: '08:47 PM',
        location: 'Main Auditorium',
        description: 'Alumni panel sharing their journey from student to junior developer. Ask them anything!',
        type: 'Tech Talk'
      }
    ];
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return { month, day };
  }

  function getTypeColor(type: string) {
    switch (type) {
      case 'Workshop':
        return { backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' };
      case 'Study Jam':
        return { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' };
      case 'Tech Talk':
        return { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' };
      default:
        return { backgroundColor: 'rgba(107, 114, 128, 0.2)', color: '#9ca3af' };
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-base sm:text-lg md:text-xl text-gray-400">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">Upcoming Events</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            From hands-on workshops to chill study jams. Come learn, hang out, and meet your future best friends.
          </p>
        </div>

        {/* 3-column grid layout */}
        <div className="events-grid">
          {events.map((event, index) => {
            const { month, day } = formatDate(event.date);
            const typeStyle = getTypeColor(event.type);
            return (
              <div
                key={event.id}
                className={`event-card animate-fade-in-up animation-delay-${(index % 3 + 1) * 100}`}
              >
                {/* Date Badge - Top of card */}
                <div className="event-card-date">
                  <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">{month}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white leading-none">{day}</div>
                </div>

                {/* Event Type Badge */}
                <div className="mb-2 sm:mb-3">
                  <span className="event-type-badge text-xs sm:text-sm" style={typeStyle}>
                    {event.type}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="event-card-title text-lg sm:text-xl">{event.title}</h3>

                {/* Event Meta */}
                <div className="event-card-meta text-sm">
                  <div className="event-meta-item">
                    <span>🕐</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="event-meta-item">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="event-card-description text-sm sm:text-base">{event.description}</p>

                {/* RSVP Button */}
                <button className="btn-animated w-full sm:w-auto">
                  <span className="btn-text">RSVP Now</span>
                  <span className="btn-ripple"></span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
