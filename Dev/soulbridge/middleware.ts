import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isUserAdmin } from '@/lib/admin/check-admin'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/create-memorial(.*)',
  '/my-memorials(.*)',
  '/settings(.*)',
  '/checkout(.*)',
  '/memorials/:id/edit(.*)',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Check if route requires admin access
  if (isAdminRoute(req)) {
    const { userId } = await auth()

    if (!userId) {
      // Not authenticated - redirect to sign-in
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Check if user is admin
    const isAdmin = await isUserAdmin(userId)

    if (!isAdmin) {
      // Not an admin - redirect to dashboard with error
      const dashboardUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(dashboardUrl)
    }

    // User is admin - allow access
    return NextResponse.next()
  }

  // Check if route requires authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
