import * as React from 'react';
import { Context } from '@/components/provider';
import { uuid } from '@/lib/util';
import { FeatureLayer } from '@/components/featureLayer';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useInitial } from '@/hooks/useInitial';
import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';
import { useRegisterDom } from '@/hooks/useRegisterDom';
import { useMutationObserver } from '@/hooks/useMutationObserver';
import { InteractionLayer } from '@/components/interactionLayer';

export interface IRawCanvasProps extends Omit<React.Props<any>, 'children'>, ICanvasProps {
  id: string;
}

interface ICanvasProps {
  style?: {
    position?: React.CSSProperties['position'];
    width?: React.CSSProperties['width'];
    height?: React.CSSProperties['height'];
    left?: React.CSSProperties['left'];
    top?: React.CSSProperties['top'];
  };
  id?: string;
}

function RawCanvas(props: IRawCanvasProps) {
  const { evtEmit } = React.useContext(Context);
  const { style, id } = props;
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  const [registerChildDom, childDomReady] = useRegisterDom();
  const [registerMyDomMount, myDomMount] = useListener();

  const observeChildMutationRef = useMutationObserver((records) => {
    const node: any = records[0].addedNodes[0];
    childDomReady(0, node);
  }, { childList: true });

  const observeAttrMuationRef = useMutationObserver(() => {
    evtEmit('canvasStyleChange', { canvasId: props.id });
  }, { attributeFilter: ['style'] });

  const handleMousemove = React.useCallback((e: React.MouseEvent) => {
    evtEmit('canvasMousemove', {
      coord: { x: e.clientX, y: e.clientY },
      canvasId: props.id
    });
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    evtEmit('canvasMouseEnter', { canvasId: props.id });
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    evtEmit('canvasMouseLeave', { canvasId: props.id });
  }, []);

  const handleMousedown = React.useCallback((e: React.MouseEvent) => {
    evtEmit('canvasMousedown', { canvasId: props.id, x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseup = React.useCallback(() => {
    evtEmit('canvasMouseup', { canvasId: props.id });
  }, []);

  const refCallback = React.useCallback((dom: HTMLDivElement | null) => {
    if (dom) {
      domRef.current = dom;
      observeChildMutationRef(dom);
      observeAttrMuationRef(dom);
    }
  }, []);

  useMount(() => {
    myDomMount(domRef.current);
    evtEmit('canvasMount', { canvasId: props.id, dom: domRef.current! });
    // 初始时同步canvasRect
    evtEmit('canvasStyleChange', { canvasId: props.id });
    return () => {
      evtEmit('canvasUnMount', { canvasId: props.id });
      domRef.current = null;
    };
  });

  return (
    <div ref={refCallback}
      style={{ position: 'relative', overflow: 'hidden', boxSizing: 'border-box', ...style }}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      onMouseDown={handleMousedown} onMouseUp={handleMouseup}
      onMouseMove={handleMousemove}>
      <FeatureLayer
        canvasId={id}
        captureDomParams={{
          idx: 0, registerChildDom,
          registerParentMount: registerMyDomMount,
          parentIsMount: !!domRef.current,
        }} />
      <InteractionLayer canvasId={id} />
    </div>
  );
}

export function Canvas(props: ICanvasProps) {
  const { id, ...restProps } = props;
  const { globalStore } = React.useContext(Context);
  const forceUpdate = useForceUpdate();
  const canvasId = React.useRef(id ?? uuid());

  useInitial(() => {
    globalStore.subscribeCanvasForceUpdate(canvasId.current, forceUpdate);
  });

  return <RawCanvas {...restProps} id={canvasId.current} />;
}
