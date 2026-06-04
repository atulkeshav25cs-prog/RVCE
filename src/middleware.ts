import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Protected routes: Any route under /citizen or /authority
const isProtectedRoute = createRouteMatcher([
  '/citizen(.*)',
  '/authority(.*)'
])

// Public routes that should bypass protection
const isPublicRoute = createRouteMatcher([
  '/citizen/login',
  '/citizen/signup',
  '/authority/login',
  '/authority/signup'
])

export default clerkMiddleware(async (auth, req) => {
  // If it's a public auth route, don't protect it
  if (isPublicRoute(req)) {
    return
  }

  if (isProtectedRoute(req)) {
    // If user is unauthenticated, auth().protect() automatically redirects them
    // to the sign-in URL configured in .env.local
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
