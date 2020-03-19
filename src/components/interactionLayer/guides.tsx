import React from 'react';
import { Context } from '@/components/provider';
import * as util from '@/lib/util';
import { style } from './style';

interface IProps {
  canvasId: string;
}

export function Guides(props: IProps) {
  const { useMappedCanvasState, globalStore } = React.useContext(Context);
  const { focusedCanvas, selectedFtrs } = useMappedCanvasState((s) => ({
    focusedCanvas: s.focusedCanvas,
    selectedFtrs: s.selectedFtrs
  }));
  if (focusedCanvas !== props.canvasId) {
    return null;
  }

  const nodes = selectedFtrs.map((id) => globalStore.getNodeByFtrId(id)!);
  const parent = nodes.length === 1 ? util.getParentNode(nodes[0]) : util.lowestCommonAncestor(nodes);
  if (!parent) {
    return null;
  }
  const rect = util.calRect(selectedFtrs.map((id) => globalStore.getFtrStyle(id)));
  const childs = util.getChildren(parent);
  const xs: number[] = [];
  childs.forEach(({ ftrId }) => {
    if (!selectedFtrs.includes(ftrId)) {
      const style = globalStore.getFtrStyle(ftrId);
      if (style.y === rect.lt.y) {
        console.log(style);
        xs.push(style.x);
      }
    }
  });
  console.log(xs[0]);
  return (
    <div className="xxx" style={style}>
      <div style={{position: 'absolute', backgroundColor: 'red', left: rect.lt.x, top: rect.lt.y, height: 2, width: xs[0]}}></div>
    </div>
  );
}
