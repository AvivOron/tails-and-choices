'use client';

import { signIn } from 'next-auth/react';
import type { ReactNode } from 'react';

type GoogleSignInButtonProps = {
  children: ReactNode;
  className: string;
  style?: React.CSSProperties;
};

export default function GoogleSignInButton({ children, className, style }: GoogleSignInButtonProps) {
  return (
    <button
      onClick={() => signIn('google')}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}
