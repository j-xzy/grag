export type IState = ReturnType<typeof createInitState>;
export type IGetState = () => ReturnType<typeof createInitState>;

export function createInitState(config: Required<IGrag.IProviderConfig>) {
  return {
    config,
    mouseCoordInCanvas: { x: 0, y: 0 } as IGrag.IXYCoord, // 鼠标位置
    focusedCanvasId: null as string | null, // 当前焦聚的canvasId
    hoverFtrId: null as string | null, // drag时hove的ftrId
    dragCompState: null as IGrag.IFtrStyle | null, // 当前拖拽组件的state
    canvasRectMap: {} as IGrag.IIndexable<DOMRect>, // canvasId到domrect映射
    ftrStateMap: {} as IGrag.IIndexable<IGrag.IFtrStyle>, //ftrId到state的映射
    selectedFtrIds: [] as string[], // 当前选中的ftrid
    beforeChangeFtrStyleMap: {} as IGrag.IIndexable<IGrag.IFtrStyle>, //开始移动之前的ftrStateMap
    isMoving: false, // 是否正在拖动
    isRect: false,  // 是否正在拉框
    mousedownCoord: {x: 0, y: 0} as IGrag.IXYCoord, // 最近一次mousedown鼠标位置
    highLightFtrs: [] as IGrag.IHighLightState[], // 高亮的ftr
    mouseInFtrId: null as string | null, // 鼠标在ftr中的ftrid
    isMousedown: false,
    resizeType: null as IGrag.IResizeType | null
  };
}
