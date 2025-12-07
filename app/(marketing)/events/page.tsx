'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

  const memberBenefits = [
    { icon: '🎟️', title: 'Priority RSVP', description: 'Get first access to limited-capacity workshops and events' },
    { icon: '🔒', title: 'Exclusive Events', description: 'Access member-only networking sessions and tech talks' },
    { icon: '📧', title: 'Early Notifications', description: 'Be the first to know when new events are announced' },
    { icon: '🎁', title: 'Free Swag', description: 'Members receive exclusive CS Society merchandise at events' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-base sm:text-lg md:text-xl text-gray-400">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Upcoming Events
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Learn, Connect, and Grow<br />
            <span className="text-cyan-400">Together</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            From hands-on workshops to chill study jams—our events are where friendships form,
            skills develop, and opportunities arise. Join us and be part of something special.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-animated">
              <span className="btn-text">Sign In to RSVP</span>
            </Link>
            <Link href="/about" className="btn-animated-secondary">
              Learn More About Us
            </Link>
          </div>
        </div>

        {/* Events Section Header */}
        <div className="mb-8 sm:mb-10 animate-fade-in-up animation-delay-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">What&apos;s Coming Up</h2>
          <p className="text-gray-400">
            Check out our upcoming events and save your spot. Members get priority access!
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
                <Link href="/login" className="btn-animated w-full sm:w-auto text-center">
                  <span className="btn-text">RSVP Now</span>
                  <span className="btn-ripple"></span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Member Benefits Section */}
        <div className="mt-16 sm:mt-20 animate-fade-in-up animation-delay-400">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block px-4 py-1 rounded-full border border-purple-500/30 text-purple-400 text-sm mb-4">
              ✦ Member Perks
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Why Members Love Our Events
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join the CS Society to unlock exclusive benefits and get the most out of every event.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {memberBenefits.map((benefit, index) => (
              <div key={index} className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-5 text-center card-hover">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#1a2a42] rounded-lg flex items-center justify-center text-2xl">
                  {benefit.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 sm:mt-20 animate-fade-in-up animation-delay-500">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Join the Fun?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Create your free account today and start RSVPing to events. Meet fellow students,
              learn new skills, and become part of our growing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-animated">
                <span className="btn-text">Create Free Account</span>
              </Link>
              <Link href="/contact" className="btn-animated-secondary">
                Have Questions? Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
