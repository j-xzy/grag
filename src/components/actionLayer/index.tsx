import * as React from 'react';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useMount } from '@/hooks/useMount';
import { RotateLayer } from './rotateLayer';
import { HighLightLayer } from './highLightLayer';
import { ResizeLayer } from './resizeLayer';
import { BoxLayer } from './boxLayer';
import { GuideLayer } from './guideLayer';
import { Context } from '../provider';
import { style } from './style';

export function ActionLayer(props: { canvasId: string; }) {
  const { globalStore } = React.useContext(Context);
  const forceUpdate = useForceUpdate();

  useMount(() => {
    const unSubscribeUpdate = globalStore.subscribeActionLayerForceUpdate(props.canvasId, forceUpdate);
    return unSubscribeUpdate;
  });

  return (
    <div style={style}>
      <HighLightLayer canvasId={props.canvasId} />
      <BoxLayer canvasId={props.canvasId} />
      <GuideLayer canvasId={props.canvasId} />
      <RotateLayer canvasId={props.canvasId} />
      <ResizeLayer canvasId={props.canvasId} />
    </div>
  );
}
