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
      {lines.hm && <div style={{ ...style, left: lines.hm[0], top: (border.lt.y + border.rb.y) / 2, width: lines.hm[1] - lines.hm[0] }}></div>}
      {lines.hb && <div style={{ ...style, left: lines.hb[0], top: border.rb.y, width: lines.hb[1] - lines.hb[0] }}></div>}
      {lines.vl && <div style={{ ...style, left: border.lt.x, top: lines.vl[0], height: lines.vl[1] - lines.vl[0] }}></div>}
      {lines.vm && <div style={{ ...style, left: (border.lt.x + border.rb.x) / 2, top: lines.vm[0], height: lines.vm[1] - lines.vm[0] }}></div>}
      {lines.vr && <div style={{ ...style, left: border.rb.x, top: lines.vr[0], height: lines.vr[1] - lines.vr[0] }}></div>}
    </>
  );
}
