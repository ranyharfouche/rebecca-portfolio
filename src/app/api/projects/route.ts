import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Initial projects data for seeding
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

// Initialize database with seed data if empty
async function initializeDatabase() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .single();
    
    if (error || !data || data.count === 0) {
      console.log('Initializing database with seed data');
      const { error: insertError } = await supabase
        .from('projects')
        .insert(initialProjects);
      
      if (insertError) {
        console.error('Failed to initialize database:', insertError);
      } else {
        console.log('Database initialized successfully');
      }
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export async function GET() {
  try {
    // Initialize if needed
    await initializeDatabase();
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('GET error:', error);
      return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
    }
    
    return NextResponse.json(projects || []);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const project = await request.json();
    
    const { data: newProject, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) {
      console.error('POST error:', error);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
    
    return NextResponse.json(newProject);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedProject = await request.json();
    
    const { data: project, error } = await supabase
      .from('projects')
      .update(updatedProject)
      .eq('id', updatedProject.id)
      .select()
      .single();
    
    if (error) {
      console.error('PUT error:', error);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
    
    return NextResponse.json(project);
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
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('DELETE error:', error);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
    
    console.log('Project deleted successfully');
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
