import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const allowedIp = process.env.ADMIN_ALLOWED_IP;

  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp =
    forwardedFor?.split(',')[0]?.trim() || request.ip || 'unknown';

  const isAdminRoute = request.nextUrl.pathname.startsWith('/dispersAdminKl0ckers');
  const isDev = process.env.NODE_ENV !== 'production';

  const isLocalhost =
    clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === '::ffff:127.0.0.1';

  const ipv6MappedAllowed = `::ffff:${allowedIp}`;

  const allowed =
    (isDev && isLocalhost) ||
    clientIp === allowedIp ||
    clientIp === ipv6MappedAllowed;

  console.log('Client IP:', clientIp);
  console.log('Allowed IP from env:', allowedIp);
  console.log('Is allowed:', allowed);

  if (isAdminRoute && !allowed) {
    console.warn(`⛔ Blocked admin access from IP: ${clientIp}`);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dispersAdminKl0ckers/:path*'],
};
