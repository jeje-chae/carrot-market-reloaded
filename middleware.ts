import { NextRequest, NextResponse } from 'next/server';
import getSession from './lib/session';

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  //로그인 하지 않은 유저들도 접근할 수 있는 url
  // array가 아니고 object를 쓴 이유는 배열에 뭔가를 포함하고 있나 검색하는 것보다 object가 약간 더 빠르기 때문
  '/': true,
  '/login': true,
  '/sms': true,
  '/create-account': true,
};
export async function middleware(request: NextRequest) {
  // middleware란 내가 원하는 모든 request를 가로챌 수 있다는 뜻
  // Edge runtime https://nextjs.org/docs/pages/api-reference/edge

  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];

  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(new URL('/products', request.url));
    }
  }

  if (!session.id) {
    // 로그인 하지 않은 상태로
    if (!exists) {
      //프라이빗 url을 접근한다면
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    // 이미 로그인을 했는데
    if (exists) {
      //로그인페이지나 회원가입으로 가려고 한다면
      return NextResponse.redirect(new URL('/products', request.url));
    }
  }
}

export const config = {
  // /user/:path* 이렇게 쓰면 user 밑에 있는 모든 곳
  // ["/((?!api|_next/static|_next/image|favicon.ico).*)"], -> url을 필터링할 정규식(nextjs 문서에서 확인 가능)  https://nextjs.org/docs/api-routes/introduction
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  // matcher: ['/', '/prohile', '/create-account', '/user/:path*'],
};
