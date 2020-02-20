import * as React from 'react';
import { Context } from '@/components/provider';
import { IEvtEmit } from '@/EventCollect';
import { RootCompId } from '@/components/root';
import { renderTree } from '@/lib/renderTree';
import { useInitial } from '@/hooks/useInitial';
import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';
import { useRegisterDom } from '@/hooks/useRegisterDom';
import { uuid } from '@/lib/uuid';

export interface IRawCanvasProps extends Omit<React.Props<any>, 'children'>, ICanvasProps {
  evtEmit: IEvtEmit;
  compMap: IGrag.ICompMap;
  domMap: IGrag.IDomMap;
  id: string;
  root: IGrag.INode;
}

interface ICanvasProps {
  style?: React.CSSProperties;
  className?: string;
  id?: string;
}

function RawCanvas(props: IRawCanvasProps) {
  const { evtEmit, style, className, compMap, domMap, id, root } = props;
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  const [registerChildDom, childDomReady] = useRegisterDom();
  const [registerMyDomMount, myDomMount] = useListener();

  const observer = React.useRef(new MutationObserver((records) => {
    const node: any = records[0].addedNodes[0];
    childDomReady(0, node);
  }));

  useMount(() => {
    function handleCanvasMousemmove(e: MouseEvent) {
      e.stopPropagation();
      evtEmit('canvasMousemove', {
        x: e.clientX,
        y: e.clientY
      });
    }
    if (!domRef.current) {
      return;
    }
    domMap[id] = domRef.current;
    observer.current.observe(domRef.current, {
      childList: true
    });
    domRef.current.addEventListener('mousemove', handleCanvasMousemmove, true);
    myDomMount(true);

    return () => {
      delete domMap[id];
      observer.current.disconnect();
      domRef.current?.removeEventListener('mousemove', handleCanvasMousemmove, true);
    };
  });

  return (
    <div ref={domRef} style={style} className={className} >
      {
        renderTree({
          root,
          compMap,
          evtEmit,
          captureDomParams: {
            idx: 0,
            registerParentMount: registerMyDomMount,
            parentIsMount: !!domRef.current,
            registerChildDom
          }
        })
      }
    </div>
  );
}

export function Canvas(props: ICanvasProps) {
  const { compMap, domMap, evtEmit, rootMap } = React.useContext(Context);
  const canvasId = React.useRef(props.id ?? uuid());

  const root = useInitial(() => {
    return rootMap[canvasId.current] = {
      compId: RootCompId,
      ftrId: uuid(),
      children: []
    };
  });

  return (
    <RawCanvas
      {...props}
      evtEmit={evtEmit}
      compMap={compMap}
      domMap={domMap}
      root={root}
      id={canvasId.current}
    />
  );
}
