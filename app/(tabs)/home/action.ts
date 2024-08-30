'use server';
import db from '@/lib/db';

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1, // 페이지에 들어갈 product 수에 현재 page를 곱함
    take: 1, // limit 1 products per page ( 한 페이지에 들어갈 product 수. ex) 25라면 한 페이지에 25개 노출)
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}
