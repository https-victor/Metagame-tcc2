import React from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import Button, { ButtonProps as AntButtonProps } from 'antd/lib/button';

export type ButtonProps = {
  key: any;
} & AntButtonProps;

export type DialogProps = {
  open: string | boolean;
  onClose(e: any): void;
  actions?: Array<ButtonProps>;
  replaceDefaultButton?: boolean;
  body?: any;
} & ModalProps;

export const Dialog = ({
  open = false,
  onClose,
  actions = [],
  replaceDefaultButton = false,
  body,
  ...props
}: DialogProps) => (
  <Modal
    onCancel={onClose}
    destroyOnClose
    {...props}
    visible={Boolean(open)}
    footer={(
      <div>
        {replaceDefaultButton ? (
          undefined
        ) : (
          <Button key="Close" ghost onClick={onClose} type="primary">
            Fechar
          </Button>
        )}
        {actions.map(({ key, ...buttonProps }: any) => (
          <Button key={key} {...buttonProps} />
        ))}
      </div>
)}
  >
    {body}
  </Modal>
);
