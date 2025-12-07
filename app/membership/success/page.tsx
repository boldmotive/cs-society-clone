import Link from 'next/link';

export default function MembershipSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-full flex items-center justify-center">
            <span className="text-5xl">🎉</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Welcome to the Club!
          </h1>
          <p className="text-gray-400 text-lg">
            Your membership is now active. You&apos;re officially part of the CS Society family.
          </p>
        </div>

        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-4">What&apos;s Next?</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3 text-gray-300 text-sm">
              <span className="text-cyan-400 mt-0.5">✓</span>
              <span>Check out upcoming events and RSVP with priority access</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300 text-sm">
              <span className="text-cyan-400 mt-0.5">✓</span>
              <span>Join our Discord community for member-only channels</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300 text-sm">
              <span className="text-cyan-400 mt-0.5">✓</span>
              <span>Explore collaborative projects and showcase your work</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300 text-sm">
              <span className="text-cyan-400 mt-0.5">✓</span>
              <span>Connect with mentors and fellow members</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/events"
            className="btn-glow bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold text-center"
          >
            Browse Events
          </Link>
          <Link
            href="/"
            className="bg-transparent text-white px-6 py-3 rounded-lg font-semibold text-center border border-gray-600 hover:border-cyan-500 transition-colors"
          >
            Go Home
          </Link>
        </div>

        <p className="mt-8 text-gray-500 text-sm">
          A confirmation email has been sent to your inbox.
          <br />
          Questions? Contact us at{' '}
          <a href="mailto:support@cssociety.org" className="text-cyan-400 hover:underline">
            support@cssociety.org
          </a>
        </p>
      </div>
    </div>
  );
}

