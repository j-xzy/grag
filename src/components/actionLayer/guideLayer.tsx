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
    ...baseStyle,
    left: line.pos.x, top: line.pos.y,
    width: 1, height: 1,
    position: 'absolute',
    boxSizing: 'border-box',
    zIndex: 10,
    borderStyle: 'solid',
    borderColor: '#007bff transparent',
    outline: 'none'
  };
  const innerStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
    outline: 'none',
    width: 1,
    height: 1
  };
  const distStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'inline-block',
    color: '#fff',
    backgroundColor: '#007bff',
    fontSize: 12,
    padding: '0px 6px',
    borderRadius: 10,
    left: style.left as number + line.length / 2 - (12 + (7 * line.length!.toString().length)) / 2,
    top: style.top as number - 22
  };
  const offset = line.offset ?? 0;
  let offsetMargin = `${offset}px 0px 0px 0px`;

  if (line.direction === 'horizontal') {
    innerStyle.width = '100%';
    style.width = line.length;
    style.borderColor = 'transparent #007bff';
  } else {
    offsetMargin = `0px 0px 0px ${offset}px`;
    innerStyle.height = '100%';
    style.height = line.length;
    distStyle.left = style.left as number - 14 - (7 * line.length!.toString().length);
    distStyle.top = style.top as number + line.length / 2 - 9;
  }
  console.debug('uide');
  return (
    <>
      <div style={{ ...style, margin: offsetMargin }}>
        <div style={innerStyle} />
      </div>
      {line.showText !== false && <div style={distStyle}>{line.length}</div>}
    </>
  );
}

function GuideBlock(props: { block: IGrag.IRect; }) {
  const { block } = props;
  const style: React.CSSProperties = {
    ...baseStyle,
    left: block.x, top: block.y,
    width: block.width, height: block.height,
    backgroundColor: 'rgba(255, 0, 62, 0.3)'
  };
  return <div style={style} />;
}
