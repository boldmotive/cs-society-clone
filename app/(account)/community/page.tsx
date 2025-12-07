'use client';

import Link from 'next/link';

export default function EventsPage() {
  // TODO: Fetch user's registered events from API
  const upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    type: 'in-person' | 'virtual' | 'hybrid';
  }> = [];

  const pastEvents: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
  }> = [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Events</h1>
          <p className="text-gray-400 mt-2">Events you&apos;ve registered for</p>
        </div>
        <Link
          href="/events"
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          Browse Events →
        </Link>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-3">📅</div>
            <h3 className="text-lg font-medium text-white mb-2">No upcoming events</h3>
            <p className="text-gray-400 mb-4">
              You haven&apos;t registered for any upcoming events yet.
            </p>
            <Link
              href="/events"
              className="inline-block bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📍</span>
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      event.type === 'virtual'
                        ? 'bg-purple-500/20 text-purple-400'
                        : event.type === 'hybrid'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Events */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Past Events</h2>
        {pastEvents.length === 0 ? (
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6 text-center">
            <p className="text-gray-400">No past events to show.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-4 opacity-75"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()} • {event.location}
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">Attended</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

