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
    mouseCoord, focusedCanvas
  } = useMappedCanvasState((s) => ({
    isRect: s.isRect,
    mousedownCoord: s.mousedownCoord,
    mouseCoord: s.mouseCoord,
    focusedCanvas: s.focusedCanvas
  }));
  if (!isRect || focusedCanvas !== props.canvasId) {
    return null;
  }

  let left = 0;
  let top = 0;
  const isRight = mouseCoord.x > mousedownCoord.x;
  const isBottom = mouseCoord.y > mousedownCoord.y;
  if (isRight) {
    left = mousedownCoord.x;
  } else {
    left = mouseCoord.x;
  }
  if (isBottom) {
    top = mousedownCoord.y;
  } else {
    top = mouseCoord.y;
  }

  const rectStyle: React.CSSProperties = {
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
    backgroundColor: 'rgba(242,242,242,0.5)',
    border: '1px solid #d8d8d8',
    boxSizing: 'border-box',
    width: Math.abs(mouseCoord.x - mousedownCoord.x),
    height: Math.abs(mouseCoord.y - mousedownCoord.y),
    left,
    top
  };
  return (
    <div style={style}>
      <div style={rectStyle}></div>
    </div>
  );
}
