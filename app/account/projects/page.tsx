'use client';

import Link from 'next/link';

export default function ProjectsPage() {
  // TODO: Fetch user's projects from API
  const projects: Array<{
    id: string;
    title: string;
    description: string;
    status: 'draft' | 'published' | 'archived';
    updatedAt: string;
  }> = [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Projects</h1>
          <p className="text-gray-400 mt-2">Manage your project submissions</p>
        </div>
        <Link
          href="/projects/new"
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span className="hidden sm:inline">New Project</span>
        </Link>
      </div>

      {projects.length === 0 ? (
        /* Empty State */
        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">💎</div>
          <h2 className="text-xl font-semibold text-white mb-2">No projects yet</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Start showcasing your work! Create your first project to share with the community.
          </p>
          <Link
            href="/projects/new"
            className="inline-block bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        /* Projects List */
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">{project.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'published'
                        ? 'bg-green-500/20 text-green-400'
                        : project.status === 'draft'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {project.status}
                  </span>
                  <Link
                    href={`/projects/${project.id}/edit`}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Browse Projects Link */}
      <div className="mt-8 text-center">
        <Link
          href="/projects"
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          Browse All Community Projects →
        </Link>
      </div>
    </div>
  );
}

