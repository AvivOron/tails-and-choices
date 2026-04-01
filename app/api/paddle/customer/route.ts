import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const PADDLE_API_BASE = 'https://sandbox-api.paddle.com';

async function paddleGet(path: string) {
  const res = await fetch(`${PADDLE_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function paddlePost(path: string, body: object) {
  const res = await fetch(`${PADDLE_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return res.json();
}

// GET /api/paddle/customer — returns the Paddle customer ID for the logged-in user,
// creating one in Paddle if it doesn't exist yet.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;

  // Look up existing customer by email
  const existing = await paddleGet(`/customers?email=${encodeURIComponent(email)}`);
  const existingId = existing?.data?.[0]?.id;
  if (existingId) {
    return NextResponse.json({ customerId: existingId });
  }

  // Create a new Paddle customer
  const created = await paddlePost('/customers', { email });
  const createdId = created?.data?.id;
  if (!createdId) {
    return NextResponse.json({ error: 'Failed to create Paddle customer' }, { status: 500 });
  }

  return NextResponse.json({ customerId: createdId });
}
