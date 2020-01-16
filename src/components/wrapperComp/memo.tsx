import * as React from 'react';

interface IMemoProps {
  children: React.ReactElement;
  'x-children': IGrag.INode[];
}

export const Memo = React.memo(
  (props: IMemoProps) => props.children,
  (pre, next) => pre['x-children'].length === next['x-children'].length
);
