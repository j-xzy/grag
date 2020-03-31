import * as React from 'react';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useInitial } from '@/hooks/useInitial';
import { HighLightLayer } from './highLightLayer';
import { ResizeLayer } from './resizeLayer';
import { BoxLayer } from './boxLayer';
import { Guides } from './guides';
import { style } from './style';
import { Context } from '../provider';

export function ActionLayer(props: { canvasId: string; }) {
  const { globalStore } = React.useContext(Context);
  const forceUpdate = useForceUpdate();
  useInitial(() => {
    globalStore.subscribeActionLayerForceUpdate(props.canvasId, forceUpdate);
  });
  return (
    <div style={style}>
      <HighLightLayer canvasId={props.canvasId} />
      <ResizeLayer canvasId={props.canvasId} />
      <BoxLayer canvasId={props.canvasId} />
      <Guides canvasId={props.canvasId} />
    </div>
  );
}