'use client';
import { InitialChatMessages } from '@/app/chat/[id]/page';
import { formatToTimeAgo } from '@/lib/utils';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useState } from 'react';

interface ChatMessageProps {
  initailMessages: InitialChatMessages;
  userId: number;
}

export default function ChatMessagesList({
  initailMessages,
  userId,
}: ChatMessageProps) {
  const [messages, setMessages] = useState(initailMessages);
  return (
    <div className='p-5 flex flex-col gap-5 min-h-screen justify-end'>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId ? 'justify-end' : ''
          }`}
        >
          {message.userId === userId ? null : message.user.avatar ===
            null ? null : (
            <Image
              src={message.user.avatar!}
              alt={message.user.username}
              width={50}
              height={50}
              className='size-8 rounded-full'
            />
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? 'items-end' : ''
            }`}
          >
            <span
              className={`${
                message.userId === userId ? 'bg-neutral-500' : 'bg-orange-500'
              } p-2.5 rounded-md`}
            >
              {message.payload}
            </span>
            <span className='text-xs'>
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      {/* <form className='flex relative' onSubmit={onSubmit}> */}
      <form className='flex relative'>
        <input
          required
          //onChange={onChange}
          //value={message}
          className='bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400'
          type='text'
          name='message'
          placeholder='Write a message...'
        />
        <button className='absolute right-0'>
          <ArrowUpCircleIcon className='size-10 text-orange-500 transition-colors hover:text-orange-300' />
        </button>
      </form>
    </div>
  );
}
