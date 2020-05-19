import * as React from 'react';
import { Context } from '@/components/provider';
import { style } from './style';

interface IGuideLayerProps {
  canvasId: string;
}

const baseStyle: React.CSSProperties = {
  position: 'absolute',
  display: 'inline-block',
  boxSizing: 'border-box'
};

const guideLineMap = {
  dist: DistLine,
  dash: DistLine,
  align: DistLine
};

export function GuideLayer(props: IGuideLayerProps) {
  const { useMappedCanvasState } = React.useContext(Context);
  const { focusedCanvas, guideLines, guideBlocks } = useMappedCanvasState((s) => ({
    focusedCanvas: s.focusedCanvas,
    guideLines: s.guideLines,
    guideBlocks: s.guideBlocks,
  }));
  if (focusedCanvas !== props.canvasId) {
    return null;
  }
  return (
    <div style={style}>
      {guideBlocks.map((block, idx) => <GuideBlock key={idx} block={block} />)}
      {guideLines.map((line, idx) => {
        const Comp = guideLineMap[line.type];
        return <Comp key={idx} line={line} />;
      })}
    </div>
  );
}



function DistLine(props: { line: IGrag.IGuideLine; }) {
  const { line } = props;
  const style: React.CSSProperties = {
    ...baseStyle, backgroundColor: '#007bff',
    left: line.pos.x, top: line.pos.y,
    width: 1, height: 1,
  };

  if (line.direction === 'horizontal') {
    style.width = line.length;
  } else {
    style.height = line.length;
  }

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
  if (line.direction === 'vertical') {
    dist = style.height;
    distStyle.left = style.left as number - 14 - (7 * dist!.toString().length);
    distStyle.top = style.top as number + (style.height as number) / 2 - 9;
  }
  return (
    <>
      <div style={style} />
      <div style={distStyle}>{dist}</div>
    </>
  );
}

export function GuideBlock(props: { block: IGrag.IRect; }) {
  const { block } = props;
  const style: React.CSSProperties = {
    ...baseStyle,
    left: block.x, top: block.y,
    width: block.width, height: block.height,
    backgroundColor: 'rgba(255, 0, 62, 0.5)'
  };
  return <div style={style} />;
}
