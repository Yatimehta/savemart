import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Cart items cannot be empty' }, { status: 400 });
    }
    const order = createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
