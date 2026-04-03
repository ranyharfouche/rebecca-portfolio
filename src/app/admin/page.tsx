'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, LogOut } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
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
    image: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>('');

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
      console.log('Saving project:', project);
      
      // Handle image upload if selected
      let imageUrl = project.image;
      if (editSelectedImage) {
        const formData = new FormData();
        formData.append('file', editSelectedImage);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          alert('Failed to upload image');
          return;
        }
      }
      
      const projectToSave = { ...project, image: imageUrl };
      
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectToSave)
      });
      if (response.ok) {
        fetchProjects();
        setEditingProject(null);
        setEditSelectedImage(null);
        setEditImagePreview('');
        alert('Project saved successfully!');
      }
    } catch (error) {
      alert('Failed to save project');
    }
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setEditSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        console.log('Deleting project with ID:', id);
        const response = await fetch(`/api/projects?id=${id}`, {
          method: 'DELETE'
        });
        console.log('Delete response:', response.status);
        if (response.ok) {
          fetchProjects();
          alert('Project deleted successfully!');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete project: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleAddProject = async () => {
    try {
      console.log('Adding project:', newProject);
      
      // Handle image upload if selected
      let imageUrl = newProject.image;
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          alert('Failed to upload image');
          return;
        }
      }
      
      const projectToSave = { ...newProject, image: imageUrl };
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectToSave)
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const addedProject = await response.json();
        console.log('Successfully added:', addedProject);
        
        fetchProjects();
        setNewProject({
          id: 0,
          title: '',
          category: '',
          description: '',
          image: ''
        });
        setSelectedImage(null);
        setImagePreview('');
        alert('Project added successfully!');
      } else {
        const errorData = await response.json();
        console.error('Add error:', errorData);
        alert(`Failed to add project: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Add error:', error);
      alert('Failed to add project');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block mb-2">
                <span className="text-purple-300 text-sm">Project Image (Recommended: 1200x800px, Max 5MB)</span>
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  {imagePreview && (
                    <p className="text-xs text-purple-400 mt-2">
                      Selected: {selectedImage?.name} ({(selectedImage!.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                {imagePreview && (
                  <div className="w-24 h-24 border-2 border-purple-500/30 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <input
              type="url"
              placeholder="Or Image URL (if not uploading)"
              value={newProject.image}
              onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
              className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 md:col-span-2"
            />
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
                    {/* Edit Image Upload */}
                    <div className="md:col-span-2">
                      <label className="block mb-2">
                        <span className="text-purple-300 text-sm">Project Image (Recommended: 1200x800px, Max 5MB)</span>
                      </label>
                      
                      {/* Show new image selection */}
                      {editImagePreview && (
                        <div className="border-2 border-purple-500/30 rounded-lg p-3 mb-4">
                          <p className="text-sm text-purple-300 mb-2">New image preview:</p>
                          <div className="flex gap-4 items-start">
                            <div className="flex-1">
                              <p className="text-xs text-purple-400 mb-2">
                                Selected: {editSelectedImage?.name} ({(editSelectedImage!.size / 1024 / 1024).toFixed(2)} MB)
                              </p>
                            </div>
                            <div className="w-24 h-24 border-2 border-purple-500/30 rounded-lg overflow-hidden">
                              <img
                                src={editImagePreview}
                                alt="New image preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* File input - always show when replacing */}
                      <div className="flex gap-4 items-start">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageSelect}
                            className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setEditImagePreview(''); // Clear preview to trigger file selection
                            setEditSelectedImage(null);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Replace Image
                        </button>
                      </div>
                    </div>
                    
                    <input
                      type="url"
                      placeholder="Or Image URL (if not uploading)"
                      value={editingProject.image}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 md:col-span-2"
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
                                  </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
