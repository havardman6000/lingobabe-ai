// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Define valid language paths
  const validLanguages = ['chinese', 'japanese', 'korean', 'spanish']
  const path = request.nextUrl.pathname

  // Handle direct access to language routes
  for (const lang of validLanguages) {
    if (path === `/${lang}`) {
      return NextResponse.redirect(new URL(`/chat/${lang}`, request.url))
    }
  }

  // Handle chat routes
  if (path.startsWith('/chat')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/chinese', '/japanese', '/korean', '/spanish', '/chat/:path*']
}