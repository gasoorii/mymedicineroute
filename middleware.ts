import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Not logged in — redirect to login
  if (!user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Logged in — block access to login/join
  if (user && (path === '/login' || path === '/join')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const dest = profile?.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Role guard — mentor trying to access student dashboard and vice versa
  if (user && path.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'mentor' && path.startsWith('/dashboard/student')) {
      return NextResponse.redirect(new URL('/dashboard/mentor', request.url));
    }
    if (profile?.role === 'student' && path.startsWith('/dashboard/mentor')) {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/join'],
};
