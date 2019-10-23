import React from 'react';
import { Button } from 'antd';
import { SignUpForm } from '../forms/SignUpForm';

export const SignUp = ({ form, onSignUp }: any) => (
  <div>
    <div>
      Sign Up
      <SignUpForm form={form} />
      <Button type="primary" onClick={onSignUp}>Create Account</Button>
    </div>
  </div>
);
