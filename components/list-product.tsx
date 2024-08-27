import { formatToTimeAgo, formatToWon } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}
export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
}: ListProductProps) {
  console.log(title);
  return (
    <Link href={`/products/${id}`} className='flex gap-5'>
      <div className='relative size-28 rounded-md overflow-hidden'>
        <Image fill src={photo} alt={title} />
        {/* 만약 이미지의 크기를 모른다면 fill로 넣으면 부모의 크기를 꽉 채움 */}
      </div>
      <div className='flex flex-col gap-1 *:text-white'>
        <span className='text-lg'>{title}</span>
        <span className='text-sm text-neutral-500'>
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className='text-lg font-sem'>{formatToWon(price)} 원</span>
      </div>
    </Link>
  );
}
