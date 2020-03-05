export type IState = ReturnType<typeof createInitState>;
export type IGetState = () => ReturnType<typeof createInitState>;

export function createInitState(config: Required<IGrag.IProviderConfig>) {
  return {
    config,
    focusedCanvas: null as string | null, // 当前焦聚的canvasId
    canvasRects: {} as IGrag.IIndexable<DOMRect>, // canvasId到domrect映射
    mouseCoord: { x: 0, y: 0 } as IGrag.IXYCoord, // 鼠标位置
    mousedownCoord: {x: 0, y: 0} as IGrag.IXYCoord, // 最近一次mousedown鼠标位置
    ftrStyles: {} as IGrag.IIndexable<IGrag.IFtrStyle>, //ftrId到state的映射
    beforeChangeFtrStyles: {} as IGrag.IIndexable<IGrag.IFtrStyle>, //开始移动之前的ftrStateMap
    dragCompStyle: null as IGrag.IFtrStyle | null, // 当前拖拽组件的state
    selectedFtrs: [] as string[], // 当前选中的ftrid
    highLightFtrs: [] as IGrag.IHighLightState[], // 高亮的ftr
    mouseInFtr: null as string | null, // 鼠标在ftr中的ftrid
    hoverFtr: null as string | null, // drag时hove的ftrId
    isMoving: false, // 是否正在拖动
    isRect: false,  // 是否正在拉框
    isMousedown: false, // 鼠标是否down
    resizeType: null as IGrag.IResizeType | null //resize时类型
  };
}
