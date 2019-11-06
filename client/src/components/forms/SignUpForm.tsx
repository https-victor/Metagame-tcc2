import React from 'react';
import { Form, Icon } from 'antd';
import emailMask from 'text-mask-addons/dist/emailMask';
import { Input } from '../generics';
// import { eventTargetValue } from '../../utils/functions';

export const SignUpForm = ({ form }: any) => {
  const { values, errors, onChange, onBlur } = form;
  return (
    <div className="sign-up">
      <Form>
        <Input
          value={values.name}
          error={errors.name}
          label="Nome"
          onChange={onChange('name', (e:any)=>e.target.value)}
          onBlur={onBlur('name')}
          prefix={<Icon type="user" />}
          />
        <Input
          value={values.email}
          error={errors.email}
          label="E-mail"
          mask={emailMask}
          onChange={onChange('email', (e:any)=>e.target.value)}
          onBlur={onBlur('email')}
          prefix={<Icon type="mail" />}
          />
        <Input
          label="Senha"
          type={'password'}
          value={values.password}
          error={errors.password}
          onBlur={onBlur('password')}
          prefix={<Icon type="lock" />}
          onChange={onChange('password', (e:any)=> e.target.value, true)}
          
          />
        <Input
          label="Confirmar senha"
          type={'password'}
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={onChange('confirmPassword', (e:any)=> e.target.value, true)}
          onBlur={onBlur('confirmPassword')}
          prefix={<Icon type="lock" />}
        />
      </Form>
    </div>
  );
};
