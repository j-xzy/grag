import * as React from 'react';
import { HighLightLayer } from './highLightLayer';
import { ResizeLayer } from './resizeLayer';
import { RectLayer } from './rectLayer';
import { Guides } from './guides';
import { style } from './style';
import { Context } from '../provider';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useInitial } from '@/hooks/useInitial';

export function InteractionLayer(props: { canvasId: string; }) {
  const { globalStore } = React.useContext(Context);
  const forceUpdate = useForceUpdate();
  useInitial(() => {
    globalStore.subscribeInteractionLayerForceUpdate(props.canvasId, forceUpdate);
  });
  return (
    <div style={style}>
      <HighLightLayer canvasId={props.canvasId} />
      <ResizeLayer canvasId={props.canvasId} />
      <RectLayer canvasId={props.canvasId} />
      <Guides canvasId={props.canvasId} />
    </div>
  );
}
