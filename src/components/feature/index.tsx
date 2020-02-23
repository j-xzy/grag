import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Context } from '@/components/provider';
import { ItemTypes } from '@/lib/itemTypes';
import { useDrag } from 'dnd';
import { useInitial } from '@/hooks/useInitial';
import { uuid } from '@/lib/uuid';

interface IProps extends React.Props<any>, IGrag.ICompOption {
  component: IGrag.ICompFcClass;
  id?: string;
  children: (ref: React.MutableRefObject<any>) => React.ReactNode;
}

export interface IDragItem {
  type: string;
  compId: string;
}

const PREVIEW_WRAPPER_ID = '__grag_preview_wrapper';

export function Feature(props: IProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const compId = React.useRef(props.id ?? uuid());
  const { canvaStore } = React.useContext(Context);

  useInitial(() => {
    canvaStore.setCompInfo(compId.current, {
      Component: props.component,
      option: {
        allowChild: props.allowChild ?? false
      }
    });
  });

  const [, drag, connectPreview] = useDrag({
    item: { type: ItemTypes.CANVAS, compId: compId.current } as IDragItem,
    begin() {
      const WrapperEle = getPreviewWrapperEle();
      ReactDOM.render(React.createElement(props.component), WrapperEle);
      const {width, height} = window.getComputedStyle(WrapperEle);
      
      connectPreview(WrapperEle.firstElementChild, {
        offsetX: parseInt(width) / 2,
        offsetY:  parseInt(height) / 2
      });
    }
  });

  React.useEffect(() => {
    drag(domRef);
  }, []);

  return props.children(domRef) as React.ReactElement;
}

function getPreviewWrapperEle() {
  let WrapperEle = document.getElementById(PREVIEW_WRAPPER_ID);
  if (!WrapperEle) {
    WrapperEle = document.createElement('div');
    WrapperEle.id = PREVIEW_WRAPPER_ID;
    WrapperEle.style.position = 'absolute';
    WrapperEle.style.left = '-10000px';
    WrapperEle.style.top = '-10000px';
    document.body.appendChild(WrapperEle);
  }
  return WrapperEle;
}
