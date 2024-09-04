import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

async function Username() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const user = await getUser();
  return <h1>Wlcome! {user?.username}!</h1>;
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    'use server';
    const session = await getSession();
    await session.destroy();
    redirect('/');
  };
  return (
    <div>
      <Suspense fallback={'hello'}>
        <Username />
      </Suspense>
      {/* form 안에 버튼 하나만 존재할 때는 버튼을 클릭 할 때마다 form을 제출 */}
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}
