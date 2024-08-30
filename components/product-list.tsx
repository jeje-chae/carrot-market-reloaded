'use client';

import { InitialProducts } from '@/app/(tabs)/home/page';
import ListProduct from './list-product';
import { useEffect, useRef, useState } from 'react';
import { getMoreProducts } from '@/app/(tabs)/home/action';

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastpage, setIsLastpage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null); // document.getElementById('load-more'); 이랑 비슷함

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          // .isIntersecting은 유저에게 해당 element(load more)에 도달을 때 true
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            //마지막 페이지가 아닐때만 page 더해줌
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]); // ...을 넣는 이유는 spread syntax를 사용해서 prev array에 newProducts array를 push할 수 있음
          } else {
            setIsLastpage(true);
          }

          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
        rootMargin: '0px 0px -100px 0px',
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className='p-5 flex flex-col gap-5'>
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {/* {!isLastpage ? (
        <span
          ref={trigger}
          className='text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95'
        >
          {isLoading ? '로딩 중' : 'Load more'}
        </span>
      ) : null} */}
    </div>
  );
}
