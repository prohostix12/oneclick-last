import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await getDatabase();
    const projects = await db.collection('projects')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Map _id to id for frontend compatibility
    const formatted = projects.map(p => ({
      ...p,
      id: p._id.toString()
    }));

    return NextResponse.json({ projects: formatted }, { status: 200 });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, images, clientName } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const project = {
      title,
      description,
      category,
      images: images || [],
      clientName: clientName || null,
      status: 'published',
      createdAt: new Date()
    };

    const result = await db.collection('projects').insertOne(project);

    return NextResponse.json(
      { 
        message: 'Project created successfully!', 
        project: { ...project, id: result.insertedId.toString() } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
