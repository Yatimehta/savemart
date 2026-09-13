import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct, getCuratedRoutineProducts } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const inStock = searchParams.get('inStock') === 'true';
    const sort = (searchParams.get('sort') as any) || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    const isRoutine = searchParams.get('routine') === 'true';

    if (isRoutine) {
      const routine = getCuratedRoutineProducts();
      return NextResponse.json({ routine });
    }

    const result = getProducts({
      category,
      search,
      inStock,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || typeof body.price !== 'number') {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }
    const created = addProduct(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
