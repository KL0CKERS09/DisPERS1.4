import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const allowedIp = process.env.ADMIN_ALLOWED_IP;

  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor?.split(',')[0]?.trim() ?? request.ip;

  console.log('Access attempt from IP:', clientIp);

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Allow localhost during development or testing
  const isDev = process.env.NODE_ENV !== 'production';
  const isLocalhost = clientIp === '127.0.0.1' || clientIp === '::1';

  // Also allow IPv6-mapped version of the allowed IP
  const ipv6MappedAllowed = `::ffff:${allowedIp}`;

  if (
    isAdminRoute &&
    !(
      isDev && isLocalhost ||
      clientIp === allowedIp ||
      clientIp === ipv6MappedAllowed
    )
  ) {
    console.warn(`Blocked admin access from IP: ${clientIp}`);
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
