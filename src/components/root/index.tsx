import * as React from 'react';

export const RootCompId = 'root';
export const RootFtrId = 'root';

export function Root(props: React.Props<any>) {
  return <div style={{ width: '100%', height: '100%' }}>{props.children}</div>;
}
