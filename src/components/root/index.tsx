import * as React from 'react';

function Root(props: React.Props<any>) {
  return <div style={{ width: '100%', height: '100%' }}>{props.children}</div>;
}

export const RootCompId = 'root';

export const RootInfo: IGrag.ICompInfos[''] = {
  Component: Root,
  option: {
    allowChild: true
  }
};
