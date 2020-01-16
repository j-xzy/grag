import { Root } from '@/components/root';
export type IState = ReturnType<typeof createInitState>;
export type IGetState = () => ReturnType<typeof createInitState>;

export function createInitState() {
  return {
    maxId: 0,
    root: {
      component: Root,
      children: []
    } as IGrag.INode
  };
}
