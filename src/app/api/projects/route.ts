import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Initial projects data
const initialProjects = [
  {
    id: 1,
    title: "Abandoned Horror Lab",
    category: "3D Environment",
    description: "A hauntingly detailed horror environment featuring abandoned laboratory equipment and eerie atmospheric lighting.",
    platforms: ["3ds Max", "Substance Painter", "Unreal Engine"],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Female Body",
    category: "Character Modeling",
    description: "Anatomically accurate female character model with detailed topology and realistic texturing.",
    platforms: ["Zbrush", "Marvelous Designer", "Substance Painter"],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Armor",
    category: "Hard Surface Modeling",
    description: "Intricately designed fantasy armor with detailed engravings and realistic material properties.",
    platforms: ["3ds Max", "Zbrush", "Substance Painter"],
    image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Robot",
    category: "Mechanical Design",
    description: "Futuristic robot design with complex mechanical parts and weathered industrial aesthetics.",
    platforms: ["3ds Max", "Zbrush", "Adobe After Effects"],
    image: "https://images.unsplash.com/photo-1561518776-e045b6afac2e?w=400&h=300&fit=crop"
  }
];

async function readProjects() {
  try {
    let projects = await kv.get('projects');
    if (!projects) {
      // Initialize with default data if empty
      await kv.set('projects', JSON.stringify(initialProjects));
      projects = await kv.get('projects');
    }
    return JSON.parse(projects as string);
  } catch (error) {
    console.error('Failed to read projects from KV:', error);
    return initialProjects;
  }
}

async function writeProjects(newProjects: any[]) {
  try {
    await kv.set('projects', JSON.stringify(newProjects));
  } catch (error) {
    console.error('Failed to write projects to KV:', error);
  }
}

export async function GET() {
  try {
    const projectsData = await readProjects();
    return NextResponse.json(projectsData);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const project = await request.json();
    const projectsData = await readProjects();
    
    const newProject = {
      ...project,
      id: Date.now(),
    };
    
    projectsData.push(newProject);
    await writeProjects(projectsData);
    
    return NextResponse.json(newProject);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedProject = await request.json();
    const projectsData = await readProjects();
    
    const index = projectsData.findIndex((p: any) => p.id === updatedProject.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    projectsData[index] = updatedProject;
    await writeProjects(projectsData);
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    
    console.log('DELETE request received for ID:', id);
    
    if (!id) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }
    
    const projectsData = await readProjects();
    console.log('Current projects:', projectsData.length);
    
    const filteredProjects = projectsData.filter((p: any) => p.id !== id);
    console.log('After filtering:', filteredProjects.length);
    
    if (projectsData.length === filteredProjects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    await writeProjects(filteredProjects);
    console.log('Project deleted successfully');
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
