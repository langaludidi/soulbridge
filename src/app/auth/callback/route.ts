import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);

      // Redirect to the intended destination
      return NextResponse.redirect(new URL(next, request.url));
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/sign-in?error=auth_failed', request.url));
    }
  }

  // If no code, redirect to sign-in
  return NextResponse.redirect(new URL('/sign-in', request.url));
}
