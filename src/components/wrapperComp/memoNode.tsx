import * as React from 'react';

interface IMemoProps extends React.Props<any> {
  node: IGrag.INode;
  children: React.ReactElement;
}

export const MemoNode = React.memo(
  (props: IMemoProps) => props.children,
  (pre, next) => pre.node === next.node
);
