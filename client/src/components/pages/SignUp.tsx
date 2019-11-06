import React from 'react';
import { Button } from 'antd';
import { SignUpForm } from '../forms/SignUpForm';
import pigeonArcher from '../../assets/png/pigeon-archer.png';
import './style/signup.css';

export const SignUp = ({ form, onSignUp }: any) => (
  <div className="page center">
    <div className="card">
      <div className="sign-up-container">
        <p>Cadastrar-se</p>
        <SignUpForm form={form} />
        <Button type="primary" onClick={onSignUp}>
          Criar conta
        </Button>
      </div>
    </div>
    <div className="hero-container">
      <img src={pigeonArcher} alt="" width={350} />
      <p>Role iniciativa!</p>
    </div>
  </div>
);
