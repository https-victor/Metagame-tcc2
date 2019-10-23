import React from 'react';

import { Button, Tooltip } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { TooltipProps } from 'antd/lib/tooltip';

export interface ActionProps {
  /**
   * Nome do ícone
   */
  icon: string;
  /**
   * Título a ser exibido na tooltip
   */
  title?: string;
  /**
   * Indica o status de loading do botão
   */
  loading?: boolean;
  /**
   * Identificador único do componente. Utilizado quando o mesmo é renderizado em um map
   */
  key?: any;
  /**
   * Contém as props da tooltip
   */
  tooltipProps?: TooltipProps;
}

export type ActionType = ButtonProps & ActionProps;

/**
 * Renderiza um botão com tooltip
 */
export const Action = ({
  icon,
  title,
  loading = false,
  tooltipProps = undefined,
  ...props
}: ActionType) => {
  const buttonProps: ActionType = {
    // style: { display: 'flex', justifyContent: 'center' },
    loading,
    disabled: loading,
    shape: 'circle',
    icon,
    ...props,
  };

  return title ? (
    <Tooltip title={title} {...tooltipProps}>
      <Button {...buttonProps} />
    </Tooltip>
  ) : (
    <Button {...buttonProps} />
  );
};
