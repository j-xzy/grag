// import { Root } from '@/components/root';
import { renderTree } from '@/lib/renderTree';
import { IDispatch, IUseMappedState } from '@/store';
import React from 'react';

export interface IBoardProps extends Omit<React.Props<any>, 'children'> {
  style?: React.CSSProperties;
  className?: string;
  dispatch: IDispatch;
  useMappedState: IUseMappedState;
}

const tree: IGrag.INode = {
  component: Foo,
  children: [{
    component: Bar,
    children: []
  },{
    component: Bar,
    children: []
  }]
};

function Foo(props: any) {
  console.log('1')
  return <div>{props.children}</div>
}

function Bar(props: any) {
  console.log('2')
  return <div>{props.children}</div>
}


export function Board(props: IBoardProps) {
  const [flag, setFlag] = React.useState(false);
  const { style, className, dispatch, useMappedState } = props;
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  React.useEffect(() => {
    setFlag(true)
    console.log('parent')
    const observer = new MutationObserver((records) => {
      // cb(records[0].addedNodes[0] as HTMLElement);
      console.log(records)
    });

    if (domRef.current) {
      observer.observe(domRef.current, {
        childList: true
      });
    }
  }, []);

  return (
    <div ref={domRef} style={style} className={className}>
      {
        flag ? renderTree(tree, { useMappedState, dispatch }, (d) => { console.log(d) }, 0) : null
      }
    </div>
  );
}
