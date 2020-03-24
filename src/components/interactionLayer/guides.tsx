import React from 'react';
import { Context } from '@/components/provider';
import { style } from './style';

interface IProps {
  canvasId: string;
}

export function Guides(props: IProps) {
  const { useMappedCanvasState } = React.useContext(Context);
  const { focusedCanvas, border, adsorbLines, distLines } = useMappedCanvasState((s) => ({
    focusedCanvas: s.focusedCanvas,
    border: s.border,
    adsorbLines: s.adsorbLines,
    distLines: s.distLines
  }));
  if (focusedCanvas !== props.canvasId || !border) {
    return null;
  }

  return (
    <div style={style}>
      <AdsorbLines border={border} lines={adsorbLines} />
      <DistLines border={border} lines={distLines} />
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

function DistLines(props: { border: IGrag.IRect; lines: Partial<IGrag.IDistLines>; }) {
  const { border, lines } = props;
  return (
    <>
      {lines.left && <DistLine style={{ left: border.lt.x - lines.left, top: (border.lt.y + border.rb.y) / 2, height: 1, width: lines.left }} />}
      {lines.right && <DistLine style={{ left: border.rb.x, top: (border.lt.y + border.rb.y) / 2, height: 1, width: lines.right }} />}
      {lines.top && <DistLine style={{ left: (border.lt.x + border.rb.x) / 2, top: border.lt.y - lines.top, height: lines.top, width: 1 }} />}
      {lines.bottom && <DistLine style={{ left: (border.lt.x + border.rb.x) / 2, top: border.rb.y, height: lines.bottom, width: 1 }} />}
    </>
  );
}

function DistLine(props: { style: React.CSSProperties; }) {
  const { style } = props;
  const outerStyle: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    zIndex: 10,
    borderStyle: 'solid',
    borderColor: '#007bff transparent',
    outline: 'none'
  };
  const innerStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
    outline: 'none'
  };

  let dist = style.width;
  const distStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'inline-block',
    color: '#fff',
    backgroundColor: '#007bff',
    fontSize: 12,
    padding: '0px 6px',
    borderRadius: 10,
    left: style.left as number + (style.width as number) / 2 - (12 + (7 * dist!.toString().length)) / 2,
    top: style.top as number - 22
  };

  let iWidth = '1px';
  let iHeight = '1px';
  let offsetMargin = '-3px 0px 0px 0px';

  if (style.width! > style.height!) {
    outerStyle.borderColor = 'transparent #007bff';
    iWidth = '100%';
  } else {
    iHeight = '100%';
    dist = style.height;
    offsetMargin = '0px 0px 0px -3px';
    distStyle.left = style.left as number - 14 - (7 * dist!.toString().length);
    distStyle.top = style.top as number + (style.height as number) / 2 - 9;
  }

  return (
    <>
      <div style={{ ...outerStyle, ...style, margin: offsetMargin }}>
        <div style={{ ...innerStyle, width: iWidth, height: iHeight }}></div>
      </div>
      <div style={distStyle}>{dist}</div>
    </>
  );
}
