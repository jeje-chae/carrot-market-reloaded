import ListProduct from '@/components/list-product';
import ProductList from '@/components/product-list';
import db from '@/lib/db';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Prisma } from '@prisma/client';
import { unstable_cache as nextCache, revalidatePath } from 'next/cache';
import Link from 'next/link';

async function getInitialProducts() {
  console.log('hit');
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    //take: 1, // limit 1 products per page
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: 'Home',
};

// unstable_cache의 첫번째 인자는 비용이 많이 드는 계산이나 데이터 베이스 query를 가동시키는 함수
// 두번째 인자는 첫번째 인자로 넘긴 함수가 리턴하는 데이터를 cache에 저장할 때 key로 사용합니다
// 세번째 인자는 cache의 expiration time(ms)인데 만약 이 시간이 지나지 않은 상태에서 user가 리프레시를 해서 이 함수를 호출하면 cache에서 data를 return하지만 이 시간이 지났을 경우에는 첫번째 인자로 받은 함수를 다시 호출합니다. {revalidate: 60,}
const getCachedProducts = nextCache(getInitialProducts, ['home-poducts']);

//export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Products() {
  const initialProducts = await getCachedProducts();
  const revalidate = async () => {
    'use server';
    revalidatePath('/home'); // revalidatePath는 해당 함수에 넘겨진 페이지의 캐시를 재검증하여 페이지의 변경된 부분만 새로고침 없이 업데이트합니다.
  };
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href='/products/add'
        className='bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400'
      >
        <PlusIcon className='size-10' />
      </Link>
    </div>
  );
}
