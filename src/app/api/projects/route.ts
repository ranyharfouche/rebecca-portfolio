import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize projects file if it doesn't exist
if (!fs.existsSync(PROJECTS_FILE)) {
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
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2));
}

function readProjects() {
  try {
    const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeProjects(projects: any[]) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

export async function GET() {
  try {
    const projects = readProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const project = await request.json();
    const projects = readProjects();
    
    const newProject = {
      ...project,
      id: Date.now(),
    };
    
    projects.push(newProject);
    writeProjects(projects);
    
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedProject = await request.json();
    const projects = readProjects();
    
    const index = projects.findIndex((p: any) => p.id === updatedProject.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    projects[index] = updatedProject;
    writeProjects(projects);
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    
    const projects = readProjects();
    const filteredProjects = projects.filter((p: any) => p.id !== id);
    
    if (projects.length === filteredProjects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    writeProjects(filteredProjects);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
