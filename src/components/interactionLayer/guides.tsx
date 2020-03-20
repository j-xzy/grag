import React from 'react';
import { Context } from '@/components/provider';
import { style } from './style';

interface IProps {
  canvasId: string;
}

export function Guides(props: IProps) {
  const { useMappedCanvasState } = React.useContext(Context);
  const { focusedCanvas, border, adsorbLines } = useMappedCanvasState((s) => ({
    focusedCanvas: s.focusedCanvas,
    border: s.border,
    adsorbLines: s.adsorbLines
  }));
  if (focusedCanvas !== props.canvasId || !border) {
    return null;
  }


  return (
    <div style={style}>
      {adsorbLines && <AdsorbLines border={border} lines={adsorbLines} />}
    </div>
  );
}

function AdsorbLines(props: { border: IGrag.IRect; lines: Partial<IGrag.IAdsorption>; }) {
  const { border, lines } = props;
  const style: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: '#ff0000',
    height: 1,
    width: 1
  };
  return (
    <>
      {lines.ht && <div style={{ ...style, left: lines.ht[0], top: border.lt.y, width: lines.ht[1] - lines.ht[0] }}></div>}
    </>
  );
}
