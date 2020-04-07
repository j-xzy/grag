import * as React from 'react';
import { Context } from '@/components/provider';

interface IProps {
  canvasId: string;
}

const style: React.CSSProperties = {
  position: 'absolute',
  cursor: 'pointer',
  pointerEvents: 'all'
};

export function RotateLayer(props: IProps) {
  const { useMappedCanvasState, evtEmit, globalStore } = React.useContext(Context);
  const { border, selectedFtrs, isMoving, isResizing } = useMappedCanvasState((s) => ({
    focusedCanvas: s.focusedCanvas,
    border: s.border,
    selectedFtrs: s.selectedFtrs,
    isMoving: s.isMoving,
    isResizing: !!s.resizeType
  }));
  const handleMousedown = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    evtEmit('rotateMousedown');
  }, []);
  const handleMouseup = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    evtEmit('rotateMouseup');
  }, []);

  if (!border || !selectedFtrs.length || isMoving || isResizing) {
    return null;
  }

  const noInCanvas = selectedFtrs.some(
    (ftrId) => globalStore.getCanvasIdByFtrId(ftrId) !== props.canvasId
  );
  if (noInCanvas) {
    return null;
  }

  const left = border.x + border.width / 2 - 6;
  const top = border.y - 24;
  const origin = {
    x: 6,
    y: border.height / 2 + 24
  };
  const rotate = selectedFtrs.length === 1 ? globalStore.getFtrStyle(selectedFtrs[0]).rotate : 0;
  return (
    <svg
      onMouseDown={handleMousedown} onMouseUp={handleMouseup}
      style={{ ...style, left, top, transformOrigin: `${origin.x}px ${origin.y}px`, transform: `rotate(${rotate}deg)` }}
      width='14' height='14'
    >
      <path
        fill='#007bff' fillRule='nonzero'
        d='M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z'
      />
    </svg>
  );
}
