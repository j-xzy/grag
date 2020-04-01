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

export function Rotate(props: IProps) {
  const { useMappedCanvasState } = React.useContext(Context);
  const { focusedCanvas } = useMappedCanvasState((s) => ({
    focusedCanvas: s.focusedCanvas,
  }));
  if (focusedCanvas !== props.canvasId) {
    return null;
  }
  return (
    <svg style={{ ...style, left: 10, top: 100 }} width='14' height='14'>
      <path
        fill='#007bff' fillRule='nonzero'
        d='M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z'
      />
    </svg>
  );
}
