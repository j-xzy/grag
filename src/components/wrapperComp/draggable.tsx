import { ItemTypes } from '@/lib/itemTypes';
import { useDrop } from 'dnd';
import * as React from 'react';

type IRegiserDom = (cb: (dom: HTMLElement) => void) => () => void;

interface IDropableProps extends React.Props<any> {
  registerDom: IRegiserDom;
}

export function Dropable(props: IDropableProps) {
  const [, drop] = useDrop({
    accept: ItemTypes.BOARD
  });

  React.useEffect(() => {
    props.registerDom((dom) => {
      drop(dom);
    });
  }, [props.registerDom]);

  return props.children as React.ReactElement;
}
