import * as React from 'react';

interface IMemoProps extends React.Props<any> {
  children: React.ReactElement;
}

export const MemoNode = React.memo(
  (props: IMemoProps) => props.children,
  () => true
);
