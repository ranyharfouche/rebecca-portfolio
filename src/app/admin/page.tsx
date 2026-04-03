'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, LogOut } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  platforms: string[];
  image: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    id: 0,
    title: '',
    category: '',
    description: '',
    platforms: [],
    image: ''
  });
  const [platformInput, setPlatformInput] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('adminToken', data.token);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
  };

  const handleSaveProject = async (project: Project) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (response.ok) {
        fetchProjects();
        setEditingProject(null);
      }
    } catch (error) {
      alert('Failed to save project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects?id=${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchProjects();
        }
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  const handleAddProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (response.ok) {
        fetchProjects();
        setNewProject({
          id: 0,
          title: '',
          category: '',
          description: '',
          platforms: [],
          image: ''
        });
        setPlatformInput('');
      }
    } catch (error) {
      alert('Failed to add project');
    }
  };

  const addPlatform = (project: Project, input: string, setter: Function) => {
    if (input.trim()) {
      setter({
        ...project,
        platforms: [...project.platforms, input.trim()]
      });
      setPlatformInput('');
    }
  };

  const removePlatform = (project: Project, platform: string, setter: Function) => {
    setter({
      ...project,
      platforms: project.platforms.filter(p => p !== platform)
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-serif text-white mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif">Project Management</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Add New Project */}
        <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-serif mb-4">Add New Project</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
            />
            <input
              type="text"
              placeholder="Category"
              value={newProject.category}
              onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
              className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
            />
            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 md:col-span-2"
              rows={3}
            />
            <input
              type="url"
              placeholder="Image URL"
              value={newProject.image}
              onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
              className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 md:col-span-2"
            />
            <div className="md:col-span-2">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add platform"
                  value={platformInput}
                  onChange={(e) => setPlatformInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPlatform(newProject, platformInput, setNewProject))}
                  className="flex-1 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => addPlatform(newProject, platformInput, setNewProject)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newProject.platforms.map((platform, index) => (
                  <span key={index} className="bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {platform}
                    <button
                      onClick={() => removePlatform(newProject, platform, setNewProject)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleAddProject}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        {/* Existing Projects */}
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
              {editingProject?.id === project.id ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    />
                    <input
                      type="text"
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    />
                    <textarea
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 md:col-span-2"
                      rows={3}
                    />
                    <input
                      type="url"
                      value={editingProject.image}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 md:col-span-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveProject(editingProject)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-serif">{project.title}</h3>
                      <p className="text-purple-300">{project.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/80 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.platforms.map((platform, index) => (
                      <span key={index} className="bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
