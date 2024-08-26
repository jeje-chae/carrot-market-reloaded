import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // middleware란 내가 원하는 모든 request를 가로챌 수 있다는 뜻
  // const pathname = request.nextUrl.pathname;
  // if (pathname === '/') {
  //   const response = NextResponse.next();
  //   response.cookies.set('middleware-cookie', 'hello!');
  //   return response;
  // }
  // if (pathname === '/profile') {
  //   return Response.redirect(new URL('/', request.url));
  // }
  // Edge runtime https://nextjs.org/docs/pages/api-reference/edge
}

export const config = {
  // /user/:path* 이렇게 쓰면 user 밑에 있는 모든 곳
  // ["/((?!api|_next/static|_next/image|favicon.ico).*)"], -> url을 필터링할 정규식(nextjs 문서에서 확인 가능)  https://nextjs.org/docs/api-routes/introduction
  matcher: ['/', '/prohile', '/create-account', '/user/:path*'],
};
