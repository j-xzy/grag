import * as React from 'react';
import { HighLightLayer } from './highLightLayer';
import { ResizeLayer } from './resizeLayer';
import { style } from './style';

export function InteractionLayer(props: { canvasId: string }) {
  return (
    <div style={style}>
      <HighLightLayer canvasId={props.canvasId} />
      <ResizeLayer canvasId={props.canvasId} />
    </div>
  );
}
