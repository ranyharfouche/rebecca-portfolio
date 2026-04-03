import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Simple authentication check
    if (username === 'becca' && password === 'beccs') {
      return NextResponse.json({ 
        success: true, 
        token: 'admin-token-' + Date.now() 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid credentials' 
    }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Authentication failed' 
    }, { status: 500 });
  }
}
