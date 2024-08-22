'use server';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import { z } from 'zod';

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
      .transform((username) => `⭐️ ${username} ⭐️`) //이게 내 최종값이 됨
      .refine(checkUsername, 'No potatoes allowed'), // refine 안에 작성한 함수가 true를 리턴하면 문제가 없다는 뜻
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
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
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }

  // try {
  //   formSchema.parse(data); parse를 하면 에러를 던짐
  // } catch (e) {
  //   console.log(e);
  // }
}
