import React from 'react';
import { Form, Button, Alert } from 'antd';
import emailMask from 'text-mask-addons/dist/emailMask';
import { Input } from '../generics';

export const LoginForm = ({ form }: any) => {
  const {
    values, errors, onChange, 
  } = form;
  return (
    <div>
      <Form layout="vertical">
        {errors.credentials && <Alert message="E-mail ou senha inválidos!" type="error" />}
        <Input
          value={values.email}
          error={errors.email}
          mask={emailMask}
          onChange={onChange('email', (e:any)=>e.target.value)}
        />
        <Input
          value={values.password}
          error={errors.password}
          onChange={onChange('password', (e:any)=>e.target.value)}
          type="password"
        />
      </Form>
    </div>
  );
};
