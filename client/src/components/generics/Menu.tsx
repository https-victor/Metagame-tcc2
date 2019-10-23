import React, { ReactNode } from 'react';
import { Menu as AntMenu } from 'antd';
import { MenuProps as AntMenuProps } from 'antd/lib/menu';
import { MenuItemProps as AntMenuItemProps } from 'antd/lib/menu/MenuItem';

export type MenuItemProps = {
  key: string | number;
  title: ReactNode | string;
  disabled?: boolean;
  antTitle?: ReactNode;
} & AntMenuItemProps

export type MenuProps = {
  options: Array<MenuItemProps>;
} & AntMenuProps;

export const Menu = ({ options, ...props }: MenuProps) => (
    <AntMenu {...props}>
      {options.map(({ title, antTitle, ...itemProps }: any) => (
        <AntMenu.Item {...itemProps} title={antTitle}>{title}</AntMenu.Item>
      ))}
    </AntMenu>
  );
