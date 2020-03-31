export type IState = ReturnType<typeof createInitState>;

export function createInitState(config: Required<IGrag.IProviderConfig>) {
  return {
    config,
    focusedCanvas: null as string | null, // 当前焦聚的canvasId
    canvasRects: {} as IGrag.IIndexable<DOMRect>, // canvasId到domrect映射
    mousePos: { x: 0, y: 0 } as IGrag.IPos, // 鼠标位置
    mousedownCoord: { x: 0, y: 0 } as IGrag.IPos, // 最近一次mousedown鼠标位置
    ftrStyles: {} as IGrag.IIndexable<IGrag.IStyle>, //ftrId到state的映射
    beforeChangeFtrStyles: {} as IGrag.IIndexable<IGrag.IStyle>, //开始移动之前的ftrStateMap
    dragCompStyle: null as IGrag.IStyle | null, // 当前拖拽组件的state
    selectedFtrs: [] as string[], // 当前选中的ftrid
    highLightFtrs: [] as IGrag.IHighLight[], // 高亮的ftr
    border: null as IGrag.IBox | null, // 选中ftr的边框 
    mouseInFtr: null as string | null, // 鼠标在ftr中的ftrid
    hoverFtr: null as string | null, // drag时hove的ftrId
    isMoving: false, // 是否正在拖动
    box: null as IGrag.IStyle | null,  // 是否正在拉框
    isMousedown: false, // 鼠标是否down
    resizeType: null as IGrag.IResizeType | null, //resize时类型
    guideLines: {} as IGrag.IIndexable<IGrag.IGuideLine>
  };
}
