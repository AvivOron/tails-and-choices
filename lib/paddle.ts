const PADDLE_API_BASE = 'https://sandbox-api.paddle.com';

async function paddleGet(path: string) {
  const res = await fetch(`${PADDLE_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY}` },
    next: { revalidate: 60 }, // cache for 60s to avoid hammering the API
  });
  if (!res.ok) return null;
  return res.json();
}

export async function hasActivePaddleSubscription(email: string): Promise<boolean> {
  // 1. Find customer by email
  const customers = await paddleGet(`/customers?email=${encodeURIComponent(email)}`);
  const customerId = customers?.data?.[0]?.id;
  if (!customerId) return false;

  // 2. Check subscriptions for that customer
  const subs = await paddleGet(`/subscriptions?customer_id=${customerId}`);
  return subs?.data?.some(
    (s: { status: string }) => s.status === 'active' || s.status === 'past_due'
  ) ?? false;
}
