import React from 'react';
import { Button } from 'antd';
import { LoginForm } from '../forms/LoginForm';

export const PopoverLogin = ({ form, onLogin }: any) => {
  const {
    onSubmit, onChange, values, errors, onBlur, 
  } = form;
  return (
    <div>
      <LoginForm
        form={{
          onChange,
          values,
          errors,
          onBlur,
        }}
      />
      <Button type="primary" onClick={onLogin}>
        Login
      </Button>
    </div>
  );
};
