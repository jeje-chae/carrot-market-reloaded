'use server';
import bcrypt from 'bcrypt';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';

const checkUsername = (username: string) => !username.includes('potato');

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const formSchema = z
  .object({
    //.optional() 필수 항목 아닐 때 이용
    username: z
      .string({
        invalid_type_error: 'Username must be a string!',
        required_error: 'Where is my username?',
      })
      .toLowerCase()
      .trim() //공백삭제
      .transform((username) => `${username}`) //이게 내 최종값이 됨
      .refine(checkUsername, 'No potatoes allowed'), // refine 안에 작성한 함수가 true를 리턴하면 문제가 없다는 뜻

    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: 'This username is already taken',
        path: ['username'],
        fatal: true, //fatal means 치명적인
      });
      return z.NEVER; //fatal가 true면 그 밑의 것들은 실행되지 않음
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: 'This email is already taken',
        path: ['email'],
        fatal: true, //fatal means 치명적인
      });
      return z.NEVER; //fatal가 true면 그 밑의 것들은 실행되지 않음
    }
  })
  .refine(checkPasswords, {
    message: 'Both password should be the same!',
    path: ['confirmPassword'],
  });

export async function createAccount(prevSate: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    // username이 이미 존재하는지 체크
    // 이메일이 이미 존재하는 지 체크
    // has password (암호화, hashFunction은 단방향)
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    // save the user to db
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    // log the user in : 쿠키에 저장
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect('/profile');
  }

  // try {
  //   formSchema.parse(data); parse를 하면 에러를 던짐
  // } catch (e) {
  //   console.log(e);
  // }
}
