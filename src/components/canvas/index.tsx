import * as React from 'react';
import { Context } from '@/components/provider';
import * as util from '@/lib/util';
import { FeatureLayer } from '@/components/featureLayer';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useMount } from '@/hooks/useMount';
import { useMutationObserver } from '@/hooks/useMutationObserver';
import { InteractionLayer } from '@/components/interactionLayer';
import { defaultStyle, cursorDics } from './config';

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
  const { evtEmit, subscribeCanvaStore, globalStore } = React.useContext(Context);
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const rootId = React.useRef(globalStore.getRoot(id)?.ftrId ?? util.uuid());

  const observeAttrMuationRef = useMutationObserver(() => {
    evtEmit('canvasStyleChange', props.id);
  }, { attributeFilter: ['style'] });

  useMount(() => {
    function handleScroll() {
      evtEmit('canvasStyleChange', props.id);
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const handleMousemove = React.useCallback((e: React.MouseEvent) => {
    evtEmit('canvasMousemove', props.id, { x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    evtEmit('canvasMouseEnter', props.id);
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
    evtEmit('canvasMount', props.id, domRef.current!);
    return () => {
      evtEmit('canvasUnMount', props.id);
      domRef.current = null;
    };
  });

  useMount(() => {
    const unSubscribe = subscribeCanvaStore((s) => ({
      isMoving: s.isMoving,
      resizeType: s.resizeType,
      focusedCanvas: s.focusedCanvas
    }), (state) => {
      if (state.focusedCanvas !== props.id) {
        return;
      }
      let cursor = 'default';
      if (state.isMoving) {
        cursor = 'move';
      } else if (state.resizeType) {
        cursor = cursorDics[state.resizeType];
      }
      if (domRef.current) {
        domRef.current.style.cursor = cursor;
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
      <FeatureLayer canvasId={id} rootId={rootId.current} />
      <InteractionLayer canvasId={id} />
    </div>
  );
}

export function Canvas(props: ICanvasProps) {
  const { id, ...restProps } = props;
  const { globalStore } = React.useContext(Context);
  const forceUpdate = useForceUpdate();
  const canvasId = React.useRef(id ?? util.uuid());

  useMount(() => {
    globalStore.subscribeCanvasForceUpdate(canvasId.current, forceUpdate);
  });

  return <RawCanvas {...restProps} id={canvasId.current} />;
}
