import * as React from 'react';
import { Context } from '@/components/provider';
import * as util from '@/lib/util';
import { FeatureLayer } from '@/components/featureLayer';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useMount } from '@/hooks/useMount';
import { useMutationObserver } from '@/hooks/useMutationObserver';
import { ActionLayer } from '@/components/actionLayer';
import { defaultStyle } from './config';

export interface IRawCanvasProps extends Omit<React.Props<any>, 'children'>, ICanvasProps {
  canvasId: string;
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
  const { style, canvasId } = props;
  const { evtEmit, subscribeCanvaStore, globalStore } = React.useContext(Context);
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const rootId = React.useRef(globalStore.getRoot(canvasId)?.ftrId ?? util.uuid());

  const observeAttrMuationRef = useMutationObserver(() => {
    evtEmit('canvasStyleChange', canvasId);
  }, { attributeFilter: ['style'] });

  useMount(() => {
    function handleScroll() {
      evtEmit('canvasStyleChange', canvasId);
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const handleMousemove = React.useCallback((e: React.MouseEvent) => {
    evtEmit('canvasMousemove', canvasId, { x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    evtEmit('canvasMouseEnter', canvasId);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    evtEmit('canvasMouseLeave');
  }, []);

  const handleMousedown = React.useCallback(() => {
    evtEmit('canvasMousedown');
  }, []);

  const handleMouseup = React.useCallback(() => {
    evtEmit('canvasMouseup');
  }, []);

  const refCallback = React.useCallback((dom: HTMLDivElement | null) => {
    if (dom) {
      domRef.current = dom;
      observeAttrMuationRef(dom);
    }
  }, []);

  useMount(() => {
    evtEmit('canvasMount', canvasId, domRef.current!);
    return () => {
      evtEmit('canvasUnMount', canvasId);
      domRef.current = null;
    };
  });

  useMount(() => {
    const unSubscribe = subscribeCanvaStore((s) => ({
      cursor: s.cursor,
      focusedCanvas: s.focusedCanvas,
    }), (state) => {
      if (state.focusedCanvas !== props.id) {
        return;
      }
      if (domRef.current) {
        domRef.current.style.cursor = state.cursor;
      }
    });
    return () => {
      unSubscribe();
    };
  });

  return (
    <div ref={refCallback} style={{ ...defaultStyle, ...style }}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      onMouseDown={handleMousedown} onMouseUp={handleMouseup} onMouseMove={handleMousemove}>
      <FeatureLayer canvasId={canvasId} rootId={rootId.current} />
      <ActionLayer canvasId={canvasId} />
    </div>
  );
}

export function Canvas(props: ICanvasProps) {
  const { id, ...restProps } = props;
  const { globalStore } = React.useContext(Context);
  const forceUpdate = useForceUpdate();
  const canvasId = React.useRef(id ?? util.uuid());

  useMount(() => {
    const unSubscribe = globalStore.subscribeCanvasForceUpdate(canvasId.current, forceUpdate);
    return unSubscribe;
  });

  return <RawCanvas {...restProps} canvasId={canvasId.current} />;
}
