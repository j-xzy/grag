import { ItemTypes } from '@/lib/itemTypes';
import { useDrop } from 'dnd';
import * as React from 'react';
import { IRegiserDom } from './captureDom';

interface IDropableProps extends React.Props<any> {
  registerDom: IRegiserDom;
}

export function Dropable(props: IDropableProps) {
  const [, drop] = useDrop({
    accept: ItemTypes.CANVAS
  });

  React.useEffect(() => {
    props.registerDom((dom) => {
      drop(dom);
    });
  }, [props.registerDom]);

  return props.children as React.ReactElement;
}
