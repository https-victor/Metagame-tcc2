import React from 'react';
import { Form } from 'antd';
import { Input } from '../generics';
import { eventTargetValue } from '../../utils/functions';

export const GameForm = ({ game, form, mode }: any) => {
  const { values, errors, onChange } = form;
  return (
    <Form className="form-game-wrapper">
      <div className="game-header">
        <Input
          value={values.name}
          placeholder={mode === 'add' ? 'Nome':undefined}
          error={errors.name}
          onChange={onChange('name', eventTargetValue)}
        />
      </div>
      <div className="description-wrapper">
        <Input
          placeholder={mode === 'add' ? 'Descrição':undefined}
          value={values.description}
          error={errors.description}
          type="textarea"
          onChange={onChange('description', eventTargetValue)}
        />
      </div>
    </Form>
  );
};
