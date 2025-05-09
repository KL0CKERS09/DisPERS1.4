import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const allowedIp = process.env.ADMIN_ALLOWED_IP;

  // Get the client IP from headers (most reliable in prod behind proxy like Vercel/Nginx)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor?.split(',')[0]?.trim() || request.ip;

  console.log('Access attempt from IP:', clientIp);

  const isAdminRoute = request.nextUrl.pathname.startsWith('/dispersAdminKl0ckers');
  const isDev = process.env.NODE_ENV !== 'production';

  const isLocalhost =
    clientIp === '127.0.0.1' ||
    clientIp === '::1' ||
    clientIp === '::ffff:127.0.0.1';

  const ipv6MappedAllowed = `::ffff:${allowedIp}`;

  if (
    isAdminRoute &&
    !(
      (isDev && isLocalhost) || // allow localhost during development
      clientIp === allowedIp ||
      clientIp === ipv6MappedAllowed
    )
  ) {
    console.warn(`⛔ Blocked admin access from IP: ${clientIp}`);
    return NextResponse.rewrite(new URL('/main/404', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dispersAdminKl0ckers/:path*'],
};
