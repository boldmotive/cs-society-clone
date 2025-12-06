'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Project {
  id: number;
  title: string;
  author: string;
  description: string;
  image_url: string;
  tags: string[];
  github_url: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        // Use mock data if database is not set up
        setProjects(getMockProjects());
      } else {
        setProjects(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      // Use mock data if there's an error
      setProjects(getMockProjects());
    } finally {
      setLoading(false);
    }
  }

  function getMockProjects(): Project[] {
    return [
      {
        id: 1,
        title: 'Personal Portfolio V1',
        author: 'Jessica L.',
        description: 'My first portfolio site showcasing my design skills. Learned a lot about CSS grid.',
        image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
        tags: ['HTML/CSS', 'Design', 'Web'],
        github_url: 'https://github.com/'
      },
      {
        id: 2,
        title: 'StudyBuddy Bot',
        author: 'Mike & Tom',
        description: 'A Discord bot that organizes study groups and sends reminders. First python project!',
        image_url: 'https://images.unsplash.com/photo-1614741118868-407581d6b44c?auto=format&fit=crop&q=80&w=800',
        tags: ['Python', 'Discord API', 'Automation'],
        github_url: 'https://github.com/'
      },
      {
        id: 3,
        title: 'Campus Navigate',
        author: 'Sarah J.',
        description: 'An interactive map to help freshmen find their classrooms. Built with React and Leaflet.',
        image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800',
        tags: ['React', 'Maps', 'Open Source'],
        github_url: 'https://github.com/'
      }
    ];
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#0a1628' }}>
        <div style={{ fontSize: '1.25rem', color: '#9ca3af' }}>Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="w-full py-20" style={{ backgroundColor: '#0a1628' }}>
      <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1rem' }}>Student Projects</h1>
          <p style={{ fontSize: '1.25rem', color: '#9ca3af' }}>
            Big or small, every project counts. Check out what our community is building.{' '}
            <span style={{ color: '#22d3ee', cursor: 'pointer' }}>
              Want to showcase yours? Submit a project.
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} style={{ backgroundColor: '#0f1d32', border: '1px solid rgba(107, 114, 128, 0.3)', borderRadius: '0.75rem', overflow: 'hidden' }}>
              {/* Project Image */}
              <div className="relative h-48" style={{ backgroundColor: '#1a2a42' }}>
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Project Details */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>By {project.author}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.75rem' }}>{project.title}</h3>
                <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2" style={{ marginBottom: '1rem' }}>
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{ fontSize: '0.75rem', fontWeight: '600', color: '#22d3ee', backgroundColor: 'rgba(6, 182, 212, 0.15)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* View Code Button */}
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#1a2a42', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '600', textDecoration: 'none', border: '1px solid rgba(107, 114, 128, 0.3)' }}
                >
                  View Code
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
