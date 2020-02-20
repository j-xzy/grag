declare namespace IGrag {
  type ICompFcClass = React.FC | React.ComponentClass;

  type IMap2Func<M> = {
    [p in keyof M]: (params: M[p]) => void;
  };

  type IFunction = (...params: any[]) => any;

  interface IXYCoord {
    x: number;
    y: number;
  }

  interface ICompMap {
    [id: string]: ICompFcClass;
  }

  interface IDomMap {
    [id: string]: HTMLElement | null;
  }

  type IReactCtxValue<T extends React.Context<any>> = T extends React.Context<infer R> ? R : any;
}
