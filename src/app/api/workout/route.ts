import { NextRequest, NextResponse } from 'next/server';
import { getWorkoutById } from '@/lib/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing workout id' }, { status: 400 });
  }

  const workout = getWorkoutById(parseInt(id));
  
  if (!workout) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  }

  return NextResponse.json(workout);
}
