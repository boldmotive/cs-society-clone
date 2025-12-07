'use client';

import Link from 'next/link';

export default function LearningPage() {
  // TODO: Fetch user's enrolled courses and progress from API
  const enrolledCourses: Array<{
    id: string;
    title: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    thumbnail?: string;
  }> = [];

  const completedCourses: Array<{
    id: string;
    title: string;
    completedAt: string;
  }> = [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Learning</h1>
          <p className="text-gray-400 mt-2">Track your learning progress</p>
        </div>
        <Link
          href="/learning"
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          Browse Courses →
        </Link>
      </div>

      {/* In Progress */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">In Progress</h2>
        {enrolledCourses.length === 0 ? (
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-3">📚</div>
            <h3 className="text-lg font-medium text-white mb-2">Start learning today</h3>
            <p className="text-gray-400 mb-4">
              You haven&apos;t enrolled in any courses yet. Explore our learning resources!
            </p>
            <Link
              href="/learning"
              className="inline-block bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">{course.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-cyan-400 font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/learning/${course.id}`}
                    className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-colors"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Courses */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Completed</h2>
        {completedCourses.length === 0 ? (
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6 text-center">
            <p className="text-gray-400">No completed courses yet. Keep learning!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <div>
                      <h3 className="font-medium text-white">{course.title}</h3>
                      <p className="text-sm text-gray-500">
                        Completed on {new Date(course.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/learning/${course.id}`}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

