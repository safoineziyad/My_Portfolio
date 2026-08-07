import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookies = request.cookies;

  if (pathname.startsWith('/ecommerce/dashboard')) {
    const token = cookies.get('session_token')?.value;
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/ecommerce/login';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/ecommerce/vendor')) {
    const token = cookies.get('marketplace_token')?.value;
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/ecommerce/store/auth';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ecommerce/dashboard/:path*', '/ecommerce/vendor/:path*'],
};
