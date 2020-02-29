import * as React from 'react';
import { style } from './style';
import { Context } from '../provider';
import { IEvtEmit } from '@/EventCollect';

interface IHandlerProps {
  rect: IRect;
  type: 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';
  evtEmit: IEvtEmit;
}

interface IRect {
  lt: IGrag.IXYCoord;
  rb: IGrag.IXYCoord;
}

export function ResizeLayer(props: { canvasId: string }) {
  const { useMappedState, globalStore, evtEmit } = React.useContext(Context);
  const { selectedFtrIds, isMoving } = useMappedState((s) => ({
    selectedFtrIds: s.selectedFtrIds,
    isMoving: s.isMoving
  }));

  if (!selectedFtrIds.length) {
    return null;
  }

  const noInCanvas = selectedFtrIds.some(
    (ftrId) => globalStore.getCanvasIdByFtrId(ftrId) !== props.canvasId
  );
  if (noInCanvas) {
    return null;
  }

  const rect = {
    lt: { x: Infinity, y: Infinity },
    rb: { x: -Infinity, y: -Infinity }
  };
  selectedFtrIds.forEach((ftrId) => {
    const style = globalStore.getFtrStyleInCanvas(ftrId);
    rect.lt.x = Math.min(rect.lt.x, style.x);
    rect.lt.y = Math.min(rect.lt.y, style.y);
    rect.rb.x = Math.max(rect.rb.x, style.x + style.width);
    rect.rb.y = Math.max(rect.rb.y, style.y + style.height);
  });

  return (
    <div style={style}>
      <Border rect={rect} />
      {
        !isMoving && <>
          <Handler evtEmit={evtEmit} rect={rect} type='nw' />
          <Handler evtEmit={evtEmit} rect={rect} type='n' />
          <Handler evtEmit={evtEmit} rect={rect} type='ne' />
          <Handler evtEmit={evtEmit} rect={rect} type='w' />
          <Handler evtEmit={evtEmit} rect={rect} type='e' />
          <Handler evtEmit={evtEmit} rect={rect} type='sw' />
          <Handler evtEmit={evtEmit} rect={rect} type='s' />
          <Handler evtEmit={evtEmit} rect={rect} type='se' />
        </>
      }
    </div>
  );
}

function Border(props: { rect: IRect }) {
  const { rect: { lt, rb } } = props;
  const style: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    width: rb.x - lt.x + 2,
    height: rb.y - lt.y + 2,
    left: lt.x - 1,
    top: lt.y - 1,
    backgroundColor: 'rgba(0,0,0,0)',
    border: '1px solid #d8d8d8'
  };
  return <div style={style}></div>;
}

function Handler(props: IHandlerProps) {
  const { type, rect: { lt, rb } } = props;
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  let top = 0;
  let left = 0;
  let resizeType = '';
  if (type === 'nw' || type === 'n' || type === 'ne') {
    top = lt.y;
  }
  if (type === 'w' || type === 'e') {
    top = lt.y + Math.floor((rb.y - lt.y) / 2);
  }
  if (type === 'sw' || type === 's' || type === 'se') {
    top = rb.y;
  }
  if (type === 'nw' || type === 'w' || type === 'sw') {
    left = lt.x;
  }
  if (type === 'n' || type === 's') {
    left = lt.x + Math.floor((rb.x - lt.x) / 2);
  }
  if (type === 'ne' || type === 'e' || type === 'se') {
    left = rb.x;
  }
  if (type === 'nw' || type === 'se') {
    resizeType = 'nwse';
  }
  if (type === 'ne' || type === 'sw') {
    resizeType = 'nesw';
  }
  if (type === 'n' || type === 's') {
    resizeType = 'ns';
  }
  if (type === 'w' || type === 'e') {
    resizeType = 'ew';
  }
  const style: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    pointerEvents: 'all',
    width: 8,
    height: 8,
    backgroundColor: '#f0f0f0',
    border: '1px solid #ededed',
    boxShadow: '0px 0px 2px #b9b9b9',
    cursor: `${resizeType}-resize`,
    top: top - 4,
    left: left - 4,
  };

  // const handleMousedown = React.useCallback((e: React.MouseEvent) => {
  //   // evtEmit('resizeMousedown', { type: resizeType });
  //   console.log('down');
  //   e.stopPropagation();
  // }, [resizeType]);

  // const handleMouseup = React.useCallback((e: React.MouseEvent) => {
  //   // evtEmit('resizeMouseup');
  //   e.stopPropagation();
  // }, [resizeType]);

  return (
    <div style={style} ref={domRef}>
    </div>
  );
}
