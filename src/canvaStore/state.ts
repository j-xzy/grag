export type IState = ReturnType<typeof createInitState>;
export type IGetState = () => ReturnType<typeof createInitState>;

export function createInitState() {
  return {
    mouseCoord: { x: 0, y: 0 } as IGrag.IXYCoord, // 鼠标位置
    focusedCanvasId: null as string | null, // 当前焦聚的canvasId
    curFtrState: null as IGrag.IFtrState | null, // 当前feature的state
    canvasRectMap: {}  as IGrag.IIndexable<DOMRect> // canvasId到domrect映射
  };
}
