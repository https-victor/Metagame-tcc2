import React from 'react';
import { Table as AntTable } from 'antd';
import { TableProps as AntTableProps, ColumnProps } from 'antd/lib/table';
import Tooltip, { TooltipProps } from 'antd/lib/tooltip';
import { ActionType, Action } from './Action';
import { DynObj } from '../../utils/types';
import './styles/table.css';

type ActionsType = {
  tooltip?: TooltipProps;
} & ActionType;

export interface TableProps {
  actions?: Array<ActionsType>;
  getActions?(item: any, idx?: any): Array<ActionsType>;
}

export type TableType = TableProps & AntTableProps<DynObj>;

export const Table = ({
  actions,
  columns,
  getActions,
  className: classNameProps,
  ...props
}: TableType) => {
  const actionsCol = actions || getActions
    ? [
      {
        title: '',
        align: 'center',
        dataIndex: 'action',
        width: getActions ? '20%' : 30 * actions!.length,
        render: (_: any, r: any, idx: any) => {
          const arrActions = getActions
            ? getActions.length === 1
              ? getActions(r)
              : getActions(r, idx)
            : actions;
          return (
            <div className="btn-container">
              {arrActions!.map((action: any, idx: number) => {
                const { tooltip, ...rest } = action;
                return (
                  <Tooltip key={idx} {...tooltip}>
                    <Action
                      shape="circle"
                      size="small"
                      type="primary"
                      ghost
                      {...rest}
                      onClick={rest.onClick(r)}
                    />
                  </Tooltip>
                );
              })}
            </div>
          );
        },
      },
    ]
    : [];
  return (
    <AntTable
      className={`table-container ${classNameProps}`}
      size="small"
      pagination={false}
      columns={[...(columns as Array<ColumnProps<DynObj>>), ...(actionsCol as Array<ColumnProps<DynObj>>)]}
      {...props}
    />
  );
};
