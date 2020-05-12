export type IState = ReturnType<typeof createInitState>;

export function createInitState(config: Required<IGrag.IProviderConfig>) {
  return {
    config,
    focusedCanvas: null as string | null, // 当前焦聚的canvasId
    canvasRects: {} as IGrag.IIndexable<DOMRect>, // canvasId到其对应的domrect映射
    mousePos: { x: 0, y: 0 } as IGrag.IPos, // 鼠标位置
    mousedownPos: { x: 0, y: 0 } as IGrag.IPos, // 最近一次mousedown鼠标位置
    ftrStyles: {} as IGrag.IIndexable<IGrag.IStyle>, //ftrId到style的映射
    beforeChangeFtrStyles: {} as IGrag.IIndexable<IGrag.IStyle>, //开始移动之前的ftrStateMap
    dragCompStyle: null as IGrag.IStyle | null, // 当前拖拽组件的state
    selectedFtrs: [] as string[], // 当前选中的ftrid
    highLightFtrs: [] as IGrag.IHighLight[], // 高亮的ftr
    border: null as IGrag.IStyle | null, // 选中ftr的边框 
    mouseInFtr: null as string | null, // 鼠标在ftr中的ftrid
    hoverFtr: null as string | null, // drag时hove的ftrId
    isMoving: false, // 是否正在拖动ftr
    isRotate: false, // 是否正在旋转ftr
    selectBox: null as IGrag.IStyle | null, // 框选
    isMousedown: false, // 鼠标是否down
    resize: null as IGrag.IResize | null, //resize时类型
    guideLines: [] as IGrag.IGuideLine[], // 辅助线
    guideBlocks: [] as IGrag.IRect[], // 辅助区块
    cursor: 'default' // 鼠标cursor
  };
}
