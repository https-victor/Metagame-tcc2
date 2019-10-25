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
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        <Input
          value={values.email}
          error={errors.email}
          label="E-mail"
          mask={emailMask}
          onChange={onChange('email', (e:any)=>e.target.value)}
          onBlur={onBlur('email')}
          prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        <Input
          label="Senha"
          value={values.password}
          error={errors.password}
          onBlur={onBlur('password')}
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          onChange={onChange('password', (e:any)=>e.target.value, true)}
          
          />
        <Input
          label="Confirmar senha"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={onChange('confirmPassword', (e:any)=>e.target.value, true)}
          onBlur={onBlur('confirmPassword')}
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
        />
      </Form>
    </div>
  );
};
