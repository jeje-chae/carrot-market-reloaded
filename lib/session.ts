import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionContent {
  id?: number;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: 'delicious-karrot',
    password: process.env.COOKIE_PASSWORD!, // !를 붙이면 무조건 존재한다는 것을 타입스크립트에게 알려주는 것
  });
}
