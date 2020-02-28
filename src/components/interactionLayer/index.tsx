import * as React from 'react';
import { HighLightLayer } from './highLightLayer';

const style: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  userSelect: 'none'
};

export function InteractionLayer(props: { canvasId: string }) {
  return (
    <div style={style}>
      <HighLightLayer canvasId={props.canvasId} />
    </div>
  );
}
