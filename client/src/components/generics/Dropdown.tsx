import React, { ReactNode } from 'react';
import {
  Dropdown as AntDropdown, Menu, Icon, Button,
} from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { IconProps } from 'antd/lib/icon';
import { MenuProps } from 'antd/lib/menu';
import { DropDownProps as AntDropDownProps } from 'antd/lib/dropdown';
import { Subtract } from '../../utils/types';

declare type OverlayFunc = () => React.ReactNode;

type AntWithoutOverlayDropDownProps = Subtract<
  AntDropDownProps,
  { overlay: React.ReactNode | OverlayFunc }
>;

export type DropDownOptionProps = {
  key: string | number;
  title: string | ReactNode;
};

export type DropdownProps = {
  options: Array<any>;
  selectedOption?: any;
  buttonProps?: ButtonProps;
  onClick?(e:any): void;
  iconProps?: IconProps;
  menuProps?: MenuProps;
  extraOption?: string | null;
  body?: ReactNode;
} & AntWithoutOverlayDropDownProps;

export const Dropdown = ({
  options = [],
  selectedOption = options[0],
  buttonProps,
  onClick,
  iconProps,
  menuProps,
  extraOption,
  body = (
    <Button type="primary" ghost {...buttonProps}>
      {selectedOption.title || ''}
      <Icon type="down" {...iconProps} />
    </Button>
  ),
  ...props
}: DropdownProps) => (
  <AntDropdown
    overlay={(
      <Menu selectedKeys={[selectedOption.id]} {...menuProps} onClick={onClick}>
        {options.map((item: any) => (
          <Menu.Item key={item.key}>{item.title}</Menu.Item>
        ))}
        {extraOption ? (
          <Menu.Item key="selectedDate">{extraOption}</Menu.Item>
        ) : null}
      </Menu>
)}
    trigger={['click']}
    {...props}
  >
    {body}
  </AntDropdown>
);
