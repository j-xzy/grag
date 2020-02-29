import * as React from 'react';
import { Context } from '@/components/provider';
import { useMount } from '@/hooks/useMount';
import { style } from './style';

interface IHighLightProps {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
}

export function HighLightLayer(props: { canvasId: string }) {
  const { useMappedState, globalStore, evtEmit } = React.useContext(Context);
  const highLightFtrs = useMappedState((s) => s.highLightFtrs);
  const highLightStates = highLightFtrs
    .filter(({ ftrId }) => globalStore.isFtrInCanvas(ftrId, props.canvasId))
    .map(({ ftrId, color, id }) => ({
      ...globalStore.getFtrStyleInCanvas(ftrId),
      color, id, ftrId
    }));
  useMount(() => {
    function handleBlur() {
      evtEmit('highLightLayerBlur');
    }
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  });
  return (
    <div style={style}>
      {
        highLightStates.map((param) => <HighLight {...param} key={`${param.id}-${param.ftrId}`} />)
      }
    </div>
  );
}

function HighLight(props: IHighLightProps) {
  const style: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    left: props.x - 2,
    top: props.y - 2,
    border: `2px solid ${props.color}`,
    width: props.width + 4,
    height: props.height + 4
  };
  return <div style={style}></div>;
}
