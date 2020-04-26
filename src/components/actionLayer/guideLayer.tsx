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

const lineStyle: Record<IGrag.IGuideLineType, React.CSSProperties> = {
  align: {
    backgroundColor: '#ff0000'
  },
  dash: {},
  dist: {}
};

export function GuideLayer(props: IGuideLayerProps) {
  const { useMappedCanvasState } = React.useContext(Context);
  const { focusedCanvas, guideLines } = useMappedCanvasState((s) => ({
    focusedCanvas: s.focusedCanvas,
    guideLines: s.guideLines,
  }));
  if (focusedCanvas !== props.canvasId || !guideLines.length) {
    return null;
  }
  return (
    <div style={style}>
      {guideLines.map((line, idx) => <GuideLine key={idx} line={line} />)}
    </div>
  );
}

function GuideLine(props: { line: IGrag.IGuideLine; }) {
  const { line } = props;
  const style: React.CSSProperties = {
    ...baseStyle, ...lineStyle[line.type],
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
