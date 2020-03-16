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

  const rect = util.calRect(selectedFtrs.map((id) => globalStore.getFtrStyle(id)));
  const nodes = selectedFtrs.map((id) => globalStore.getNodeByFtrId(id)!);
  const parent = nodes.length === 1 ? util.getParentNode(nodes[0]) : util.lowestCommonAncestor(nodes);

  return (
    <div style={style}>
    </div>
  );
}
