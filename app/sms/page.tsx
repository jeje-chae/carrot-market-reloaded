'use client';
import Button from '@/components/button';
import Input from '@/components/input';
import SocailLogin from '@/components/social-login';
import { useFormState } from 'react-dom';
import { smsLogin } from './actions';

const initailState = {
  token: false,
  error: undefined, // ts 에게 error object가 존재할 것이라고 정의
};

export default function SMSLogIn() {
  const [state, dispatch] = useFormState(smsLogin, initailState);
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>SMS Login</h1>
        <h2 className='text-xl'>Verify your phone number.</h2>
      </div>
      <form className='flex flex-col gap-3' action={dispatch}>
        {state.token ? (
          <Input
            type='number'
            placeholder='Verification code'
            required
            name='token'
            min={100000}
            max={999999}
            errors={state.error?.formErrors}
          />
        ) : (
          <Input
            type='text'
            placeholder='Phone number'
            required
            name='phone'
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.token ? 'Verify Token' : 'Send Verification SMS'} />
      </form>
    </div>
  );
}
