import * as React from 'react';
import { Context } from '@/components/provider';
import { style } from './style';

interface IHighLightProps {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
}

export function HighLightLayer(props: { canvasId: string; }) {
  const { useMappedCanvasState, globalStore } = React.useContext(Context);
  const highLightFtrs = useMappedCanvasState((s) => s.highLightFtrs);
  const highLightStates = highLightFtrs
    .filter(({ ftrId }) => globalStore.isFtrInCanvas(ftrId, props.canvasId))
    .map(({ ftrId, color, id }) => ({
      ...globalStore.getFtrStyle(ftrId),
      color, id, ftrId
    }));
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
  return <div style={style} />;
}
