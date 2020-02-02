import { RootCompId, RootFtrId } from '@/components/root';
export type IState = ReturnType<typeof createInitState>;
export type IGetState = () => ReturnType<typeof createInitState>;

export function createInitState() {
  return {
    enterFtrId: null as string | null,
    mouseCoord: { x: 0, y: 0 } as IGrag.IXYCoord,
    root: {
      compId: RootCompId,
      ftrId: RootFtrId,
      children: [],
    } as IGrag.INode
  };
}
