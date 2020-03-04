import * as React from 'react';
import { style } from './style';
import { Context } from '@/components/provider';

interface IProps {
  canvasId: string;
}

export function RectLayer(props: IProps) {
  const { useMappedCanvasState } = React.useContext(Context);
  const {
    isRect, mousedownCoord,
    mouseCoordInCanvas, focusedCanvasId
  } = useMappedCanvasState((s) => ({
    isRect: s.isRect,
    mousedownCoord: s.mousedownCoord,
    mouseCoordInCanvas: s.mouseCoordInCanvas,
    focusedCanvasId: s.focusedCanvasId
  }));
  if (!isRect || focusedCanvasId !== props.canvasId) {
    return null;
  }

  let left = 0;
  let top = 0;
  const isRight = mouseCoordInCanvas.x > mousedownCoord.x;
  const isBottom = mouseCoordInCanvas.y > mousedownCoord.y;
  if (isRight) {
    left = mousedownCoord.x;
  } else {
    left = mouseCoordInCanvas.x;
  }
  if (isBottom) {
    top = mousedownCoord.y;
  } else {
    top = mouseCoordInCanvas.y;
  }

  const rectStyle: React.CSSProperties = {
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
    backgroundColor: 'rgba(242,242,242,0.5)',
    border: '1px solid #d8d8d8',
    boxSizing: 'border-box',
    width: Math.abs(mouseCoordInCanvas.x - mousedownCoord.x),
    height: Math.abs(mouseCoordInCanvas.y - mousedownCoord.y),
    left,
    top
  };
  return (
    <div style={style}>
      <div style={rectStyle}></div>
    </div>
  );
}
