import * as React from 'react';
import { style } from './style';
import { Context } from '@/components/provider';

interface IProps {
  canvasId: string;
}

export function BoxLayer(props: IProps) {
  const { useMappedCanvasState } = React.useContext(Context);
  const { box, focusedCanvas } = useMappedCanvasState((s) => ({
    box: s.box, focusedCanvas: s.focusedCanvas
  }));

  if (!box || focusedCanvas !== props.canvasId) {
    return null;
  }

  const rectStyle: React.CSSProperties = {
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
    backgroundColor: 'rgba(242,242,242,0.5)',
    border: '1px solid #d8d8d8',
    boxSizing: 'border-box',
    width: box.width,
    height: box.height,
    left: box.x,
    top: box.y
  };
  return (
    <div style={style}>
      <div style={rectStyle}></div>
    </div>
  );
}
