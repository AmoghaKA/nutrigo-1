import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const path = req.nextUrl.pathname

    // 1. Protected Routes: /dashboard
    // If user is NOT logged in and tries to access dashboard, redirect to login
    if (path.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/auth/login', req.url))
        }

        // Strict Logic: Allow only if email is verified
        /*
        if (!session.user.email_confirmed_at) {
            const url = new URL('/auth/login', req.url)
            //url.searchParams.set('error', 'Please verify your email address first.')
            return NextResponse.redirect(url)
        }
        */
    }



    return res
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/dashboard/:path*',
        '/auth/:path*',
    ],
}
