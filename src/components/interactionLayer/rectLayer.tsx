import * as React from 'react';
import { style } from './style';
import { Context } from '@/components/provider';

interface IProps {
  canvasId: string;
}

export function RectLayer(props: IProps) {
  const { useMappedCanvasState } = React.useContext(Context);
  const { rect, focusedCanvas } = useMappedCanvasState((s) => ({
    rect: s.rect, focusedCanvas: s.focusedCanvas
  }));

  if (!rect || focusedCanvas !== props.canvasId) {
    return null;
  }

  const rectStyle: React.CSSProperties = {
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
    backgroundColor: 'rgba(242,242,242,0.5)',
    border: '1px solid #d8d8d8',
    boxSizing: 'border-box',
    width: rect.width,
    height: rect.height,
    left: rect.x,
    top: rect.y
  };
  return (
    <div style={style}>
      <div style={rectStyle}></div>
    </div>
  );
}
