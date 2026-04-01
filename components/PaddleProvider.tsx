'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializePaddle, type Paddle } from '@paddle/paddle-js';

const PaddleContext = createContext<Paddle | null>(null);

export function usePaddle() {
  return useContext(PaddleContext);
}

export default function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  useEffect(() => {
    initializePaddle({
      environment: 'sandbox',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((p) => {
      if (p) setPaddle(p);
    });
  }, []);

  return <PaddleContext.Provider value={paddle}>{children}</PaddleContext.Provider>;
}
