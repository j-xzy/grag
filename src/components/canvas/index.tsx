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
import { EventCollect } from '@/components/canvas/eventCollect';
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
  const { style, id } = props;
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  const [registerChildDom, childDomReady] = useRegisterDom();
  const [registerMyDomMount, myDomMount] = useListener();

  const observeChildMutationRef = useMutationObserver((records) => {
    const node: any = records[0].addedNodes[0];
    childDomReady(0, node);
  }, { childList: true });

  useMount(() => {
    myDomMount(domRef.current);
    observeChildMutationRef(domRef.current!);
    return () => {
      domRef.current = null;
    };
  });

  return (
    <div ref={domRef} style={{ position: 'relative', overflow: 'hidden', boxSizing: 'border-box', ...style }} >
      <EventCollect registerCanvasMount={registerMyDomMount} id={id}>
        <FeatureLayer 
          canvasId={id}
          captureDomParams={{
            idx: 0, registerChildDom,
            registerParentMount: registerMyDomMount,
            parentIsMount: !!domRef.current,
          }} />
        <InteractionLayer canvasId={id} />
      </EventCollect>
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
