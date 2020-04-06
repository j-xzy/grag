import * as React from 'react';
import { IEvtEmit } from '@/EventCollect';
import * as util from '@/lib/util';
import { style } from './style';
import { Context } from '../provider';

interface IHandlerProps {
  // box: IGrag.IStyle;
  evtEmit: IEvtEmit;
  x: number;
  y: number;
  rotate: number;
  origin: [number, number];
  type: IGrag.IResizeType;
}

const xProduct = [0, 0.5, 1, 1, 1, 0.5, 0, 0];
const yProduct = [0, 0, 0, 0.5, 1, 1, 1, 0.5];
const originProduct = [[0.5, 0.5], [0, 0.5], [-0.5, 0.5], [-0.5, 0], [-0.5, - 0.5], [0, -0.5], [0.5, -0.5], [0.5, 0]];
const resizeTypes = ['nw', 'n', 'n', 'ne', 'e', 'e', 'se', 's', 's', 'sw', 'w', 'w'];
const resizeTypes2 = ['nw', 'nw', 'n', 'ne', 'ne', 'e', 'se', 'se', 's', 'sw', 'sw', 'w'];

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
  const center = util.calRectCenter(border);
  return (
    <div style={style}>
      <Border box={border} />
      {!isMoving && <>{
        util.calRotateRectEightPts(border, border.rotate).map((_, idx) => {
          const offset = 4;
          const x = xProduct[idx] * border.width + border.x - offset;
          const y = yProduct[idx] * border.height + border.y - offset;
          const origin = [originProduct[idx][0] * border.width + offset, originProduct[idx][1] * border.height + offset];
          const type = resizeTypes[(idx + Math.floor(idx / 2) + ((idx % 2) ? Math.ceil(border.rotate / 30) : Math.floor(border.rotate / 30))) % 12];
          return <Handler key={idx} evtEmit={evtEmit} rotate={border.rotate} y={y} x={x} origin={origin} type={type} />;
        })
      }</>}
    </div>
  );
}

function Border(props: { box: IGrag.IStyle; }) {
  const { box } = props;
  const style: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    width: box.width + 2,
    height: box.height + 2,
    left: box.x - 1,
    top: box.y - 1,
    backgroundColor: 'rgba(0,0,0,0)',
    border: '1px solid #d8d8d8',
    transform: `rotate(${box.rotate}deg)`
  };
  return <div style={style} />;
}



function Handler(props: IHandlerProps) {
  const { x, y, rotate, origin, type } = props;

  const style: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    pointerEvents: 'all',
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 5px #b9b9b9',
    cursor: `${type}-resize`,
    top: y,
    left: x,
    transform: `rotate(${rotate}deg)`,
    transformOrigin: `${origin[0]}px ${origin[1]}px`
  };
  return <div style={style} />;
}

// function Handler(props: IHandlerProps) {
//   const { type, box, evtEmit } = props;
//   const offset = 4;
//   const origin = { x: offset, y: offset };
//   let top = 0;
//   let left = 0;
//   let cursor = '';
//   if (type === 'nw' || type === 'n' || type === 'ne') {
//     top = box.y;
//   }
//   if (type === 'w' || type === 'e') {
//     top = box.y + Math.floor(box.height / 2);
//   }
//   if (type === 'sw' || type === 's' || type === 'se') {
//     top = box.y + box.height;
//   }
//   if (type === 'nw' || type === 'w' || type === 'sw') {
//     left = box.x;
//   }
//   if (type === 'n' || type === 's') {
//     left = box.x + Math.floor(box.width / 2);
//   }
//   if (type === 'ne' || type === 'e' || type === 'se') {
//     left = box.x + box.width;
//   }
//   if (type === 'nw' || type === 'se') {
//     cursor = 'nwse';
//   }
//   if (type === 'ne' || type === 'sw') {
//     cursor = 'nesw';
//   }
//   if (type === 'n' || type === 's') {
//     cursor = 'ns';
//   }
//   if (type === 'w' || type === 'e') {
//     cursor = 'ew';
//   }

//   if (type === 'nw') {
//     origin.x = box.width / 2 + offset;
//     origin.y = box.height / 2 + offset;
//   }
//   if (type === 'n') {
//     origin.y = box.height / 2 + offset;
//   }

//   if (type === 'ne') {
//     origin.x = 0 - box.width / 2 + offset;
//     origin.y = box.height / 2 + offset;
//   }

//   if (type === 'w') {
//     origin.x = box.width / 2 + offset;
//   }

//   if (type === 'e') {
//     origin.x = 0 - box.width / 2 + offset;
//   }

//   if (type === 'sw') {
//     origin.x = box.width / 2 + offset;
//     origin.y = 0 - box.height / 2 + offset;
//   }
//   if (type === 's') {
//     origin.y = 0 - box.height / 2 + offset;
//   }

//   if (type === 'se') {
//     origin.x = 0 - box.width / 2 + offset;
//     origin.y = 0 - box.height / 2 + offset;
//   }

//   const style: React.CSSProperties = {
//     position: 'absolute',
//     boxSizing: 'border-box',
//     pointerEvents: 'all',
//     width: 8,
//     height: 8,
//     backgroundColor: '#fff',
//     boxShadow: '0px 0px 5px #b9b9b9',
//     cursor: `${cursor}-resize`,
//     top: top - offset,
//     left: left - offset,
//     transform: `rotate(${box.rotate}deg)`,
//     transformOrigin: `${origin.x}px ${origin.y}px`
//   };
//   const handleMousedown = React.useCallback((e: React.MouseEvent) => {
//     evtEmit('resizeMousedown', type);
//     e.stopPropagation();
//   }, [type]);

//   const handleMouseup = React.useCallback((e: React.MouseEvent) => {
//     evtEmit('resizeMouseup');
//     e.stopPropagation();
//   }, [type]);

//   return <div style={style} onMouseDown={handleMousedown} onMouseUp={handleMouseup} />;
// }
