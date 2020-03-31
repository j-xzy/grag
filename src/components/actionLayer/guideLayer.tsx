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
    color: '#ff0000'
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
    ...baseStyle,
    ...lineStyle[line.type],
    left: line.pos.x,
    top: line.pos.y
  };
  return <div style={style} />;
}

// position: absolute;
// display: inline-block;
// width: 5px;
// height: 100px;
// border-top: 1px solid #000;
// border-bottom: 1px solid #000;
// background-color: red;
// box-sizing: border-box;
// padding: 0px 2px;
// background-clip: content-box;
