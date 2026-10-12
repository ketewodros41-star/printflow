import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('pf_session')?.value

  let role: string | null = null
  if (session) {
    try { role = JSON.parse(decodeURIComponent(session)).role } catch {}
  }

  // Unauthenticated → login
  const requiresAuth = pathname.startsWith('/dashboard') || pathname.startsWith('/create')
  if (requiresAuth && !role) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Non-admin trying to access /admin
  if (pathname.startsWith('/admin') && role !== 'admin') {
    if (!role) {
      const url = new URL('/login', request.url)
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    // Merchant trying to visit /admin → send to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Already logged-in user visiting login/signup → redirect home
  if ((pathname === '/login' || pathname === '/signup') && role) {
    return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/create/:path*', '/login', '/signup'],
}
