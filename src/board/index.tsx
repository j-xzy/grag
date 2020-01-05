import React from 'react';
import { renderTree } from '../util/renderTree';

interface IProps extends React.Props<any> {
  style?: React.CSSProperties;
  className?: string;
}

export function Board(props: IProps) {
  const { style, className } = props;
  return (
    <div style={style} className={className}>
      {
        renderTree({
          component: <div>renderTree</div>,
          children: []
        })
      }
    </div>
  );
}
