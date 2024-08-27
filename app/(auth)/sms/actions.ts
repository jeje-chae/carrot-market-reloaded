'use server';

import { z } from 'zod';
import validator from 'validator'; // 처음에 에러가 나는 이유는 typescript로 만들어진 게 아니고 js 여서
import { redirect } from 'next/navigation';

//const phoneSchema = z.string().trim().refine(validator.isMobilePhone);
const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    'Wrong phone format'
  );
// refine 함수의 첫번째 argument는 우리가 refine하려는 data, 그리고 조건문을 적어주는데 그게 true인지 false인지 return 그래서 위의 두개는 같음

// coerce().number() 는 유저가 입력한 string을 number로 변환 (coericion 뜻 강제)
const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get('phone');
  const token = formData.get('token');

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      console.log(result.error.flatten());
      // 제대로된 핸드폰 번호가 입력되지 않았다면
      return {
        token: false, // 유저는 다음 단계로 넘어갈 수 없음
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
      };
    }
  } else {
    // token 검증
    const result = tokenSchema.safeParse(token);

    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
        //error: '토큰틀림',
      };
    } else {
      // login...
      redirect('/');
    }
  }
}
