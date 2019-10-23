import React, { ReactNode } from 'react';
import { Card, Icon } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { CardProps } from 'antd/lib/card';
import './styles/section.css';
import { Action } from './Action';

export interface SectionProps {
  item: ReactNode;
  extra?: ReactNode;
  actions?: Array<ButtonProps>;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: string;
  className?: string;
  noPadding?: boolean;
  zoom?: boolean;
  marginBottom?: number;
  error?: string;
}

export const Section = ({
  noPadding,
  error,
  marginBottom = 20,
  item,
  zoom = false,
  actions = [],
  title = null,
  size = 'small',
  subtitle = null,
  extra = null,
  icon,
  className,
  ...props
}: SectionProps & CardProps) => {
  const _extra = extra
    || (actions.length === 0 ? (
      undefined
    ) : (
      <div className="btn-container">
        {actions.map((btn: any) => (
          <Action
            children={undefined}
            size={size}
            shape="circle"
            ghost
            type="primary"
            {...btn}
          />
        ))}
      </div>
    ));
  const paddingClassName = noPadding ? 'no-padding' : '';
  const zoomClassName = zoom ? 'section-component-zoom' : '';
  return (
    <Card
      className={`section-component ${className} ${paddingClassName} ${zoomClassName}`}
      extra={_extra}
      bordered={false}
      title={
        title === null ? (
          undefined
        ) : (
          <div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon
                  className="section-icon"
                  type={icon}
                  style={{ marginRight: '12px' }}
                />
                {title}
              </div>
              {' '}
              {subtitle && <div className="card-subtitle">{subtitle}</div>}
            </div>
          </div>
        )
      }
      style={{ marginBottom: `${marginBottom}px` }}
      size={size}
      {...props}
    >
      {error && <div className="section-error animated fadeIn">{error}</div>}
      <div className="section-component-body">{item}</div>
    </Card>
  );
};
