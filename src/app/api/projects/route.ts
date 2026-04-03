import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for Vercel compatibility
let projects: any[] = [
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

function readProjects() {
  return projects;
}

function writeProjects(newProjects: any[]) {
  projects = newProjects;
}

export async function GET() {
  try {
    const projectsData = readProjects();
    return NextResponse.json(projectsData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const project = await request.json();
    const projectsData = readProjects();
    
    const newProject = {
      ...project,
      id: Date.now(),
    };
    
    projectsData.push(newProject);
    writeProjects(projectsData);
    
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedProject = await request.json();
    const projectsData = readProjects();
    
    const index = projectsData.findIndex((p: any) => p.id === updatedProject.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    projectsData[index] = updatedProject;
    writeProjects(projectsData);
    
    return NextResponse.json(updatedProject);
  } catch (error) {
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
    
    const projectsData = readProjects();
    console.log('Current projects:', projectsData.length);
    
    const filteredProjects = projectsData.filter((p: any) => p.id !== id);
    console.log('After filtering:', filteredProjects.length);
    
    if (projectsData.length === filteredProjects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    writeProjects(filteredProjects);
    console.log('Project deleted successfully');
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
