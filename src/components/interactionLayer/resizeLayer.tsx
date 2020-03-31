import * as React from 'react';
import { style } from './style';
import { Context } from '../provider';
import { IEvtEmit } from '@/EventCollect';

interface IHandlerProps {
  box: IGrag.IBox;
  type: IGrag.IResizeType;
  evtEmit: IEvtEmit;
}

export function ResizeLayer(props: { canvasId: string; }) {
  const { useMappedCanvasState, globalStore, evtEmit } = React.useContext(Context);
  const { selectedFtrs, isMoving, resizeType, border } = useMappedCanvasState((s) => ({
    selectedFtrs: s.selectedFtrs,
    isMoving: s.isMoving,
    resizeType: s.resizeType,
    border: s.border
  }));

  if (!selectedFtrs.length || !border) {
    return null;
  }

  const noInCanvas = selectedFtrs.some(
    (ftrId) => globalStore.getCanvasIdByFtrId(ftrId) !== props.canvasId
  );
  if (noInCanvas) {
    return null;
  }

  return (
    <div style={style}>
      <Border box={border} />
      {
        !isMoving && <>
          {(resizeType === null || resizeType === 'nw') && <Handler evtEmit={evtEmit} box={border} type='nw' />}
          {(resizeType === null || resizeType === 'n') && <Handler evtEmit={evtEmit} box={border} type='n' />}
          {(resizeType === null || resizeType === 'ne') && <Handler evtEmit={evtEmit} box={border} type='ne' />}
          {(resizeType === null || resizeType === 'w') && <Handler evtEmit={evtEmit} box={border} type='w' />}
          {(resizeType === null || resizeType === 'e') && <Handler evtEmit={evtEmit} box={border} type='e' />}
          {(resizeType === null || resizeType === 'sw') && <Handler evtEmit={evtEmit} box={border} type='sw' />}
          {(resizeType === null || resizeType === 's') && <Handler evtEmit={evtEmit} box={border} type='s' />}
          {(resizeType === null || resizeType === 'se') && <Handler evtEmit={evtEmit} box={border} type='se' />}
        </>
      }
    </div>
  );
}

function Border(props: { box: IGrag.IBox; }) {
  const { box: { lt, rb } } = props;
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
  return <div style={style} />;
}

function Handler(props: IHandlerProps) {
  const { type, box: { lt, rb }, evtEmit } = props;
  let top = 0;
  let left = 0;
  let cursor = '';
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
    cursor = 'nwse';
  }
  if (type === 'ne' || type === 'sw') {
    cursor = 'nesw';
  }
  if (type === 'n' || type === 's') {
    cursor = 'ns';
  }
  if (type === 'w' || type === 'e') {
    cursor = 'ew';
  }
  const style: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    pointerEvents: 'all',
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 5px #b9b9b9',
    cursor: `${cursor}-resize`,
    top: top - 4,
    left: left - 4,
  };

  const handleMousedown = React.useCallback((e: React.MouseEvent) => {
    evtEmit('resizeMousedown', type);
    e.stopPropagation();
  }, [type]);

  const handleMouseup = React.useCallback((e: React.MouseEvent) => {
    evtEmit('resizeMouseup');
    e.stopPropagation();
  }, [type]);

  return <div style={style} onMouseDown={handleMousedown} onMouseUp={handleMouseup} />;
}
