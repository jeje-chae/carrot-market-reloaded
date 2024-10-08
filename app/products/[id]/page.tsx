import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToWon } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { unstable_cache as nextCache } from 'next/cache';

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}
async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;

  // 만약 fetch를 이용해서 api로 get requests 할 때는 자동으로 cache된다.
  // fetch(`/api/products/${id}`, {
  //   next: {
  //     revalidate: 60,
  //     tags: ['helloooo'],
  //   },
  // });
}

const getCachedProduct = nextCache(getProduct, ['product-detail'], {
  tags: ['product-detail'],
});

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ['product-title'], {
  tags: ['product-title', 'foodie'],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const createChatRoom = async () => {
    'use server';
    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            { id: product.userId },
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/chat/${room.id}`);
  };
  return (
    <div>
      <div className='relative aspect-square'>
        <Image
          fill
          src={product.photo}
          alt={product.title}
          className='object-cover'
        />
      </div>
      <div className='p-5 flex items-center gap-3 border-b border-neutral-700'>
        <div className='size-10 rounded-full overflow-hidden'>
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className='p-5 '>
        <h1 className='text-2xl font-semibold '>{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className='fixed flex justify-between items-center w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800'>
        <span className='font-semibold text-xl'>
          {formatToWon(product.price)}
        </span>
        {isOwner && (
          <button className='bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold'>
            Delete product
          </button>
        )}
        <form action={createChatRoom}>
          <button className='bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold'>
            채팅하기
          </button>
        </form>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ id: '4' }];
}
