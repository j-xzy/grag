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

const styleMap: Record<IGrag.IGuideLineType | 'block', React.CSSProperties> = {
  align: {
    backgroundColor: '#ff0000'
  },
  dash: {},
  dist: {},
  block: {
    backgroundColor: 'rgba(255, 0, 62, 0.5)'
  },
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
      {guideLines.map((line, idx) => <GuideLine key={idx} line={line} />)}
    </div>
  );
}

function GuideLine(props: { line: IGrag.IGuideLine; }) {
  const { line } = props;
  const style: React.CSSProperties = {
    ...baseStyle, ...styleMap[line.type],
    left: line.pos.x, top: line.pos.y,
    width: 1, height: 1,
  };

  if (line.direction === 'horizontal') {
    style.width = line.length;
  } else {
    style.height = line.length;
  }
  return <div style={style} />;
}

export function GuideBlock(props: { block: IGrag.IRect; }) {
  const { block } = props;
  const style: React.CSSProperties = {
    ...baseStyle, ...styleMap.block,
    left: block.x, top: block.y,
    width: block.width, height: block.height
  };
  return <div style={style} />;
}
