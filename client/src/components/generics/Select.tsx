import React, { ReactNode } from 'react';
import { Select as AntSelect } from 'antd';
import { SelectProps as AntSelectProps } from 'antd/lib/select';
import Form, { FormItemProps } from 'antd/lib/form';
import './styles/select.css';

const { Option } = AntSelect;

export type SelectOptionProps = {
  key: string | number;
  title: string | ReactNode;
};

export interface SelectProps {
  formItemProps?: FormItemProps;
  options: Array<SelectOptionProps>;
  label?: string;
  error?: string;
  opt?: boolean;
}

export const Select = ({
  formItemProps,
  options,
  label,
  opt = false,
  error = '',
  ...props
}: SelectProps & AntSelectProps) => (
  <Form.Item
    {...{
      ...formItemProps,
      label,
      validateStatus: error ? 'error' : undefined,
      help: error,
    }}
  >
    <AntSelect
    style={{width:'100%'}}
      placeholder={opt ? 'Opcional' : 'Selecione...'}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) => String(option!.props!.children!)
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
      }
      {...props}
    >
      {options.map((o: any) => (
        <Option key={o.key} value={String(o.key)}>
          {o.title}
        </Option>
      ))}
    </AntSelect>
  </Form.Item>
);
