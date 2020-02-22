declare namespace IGrag {
  type ICompFcClass = React.FC | React.ComponentClass;

  type IObj2Func<M> = {
    [p in keyof M]: (params: M[p]) => void;
  };

  type IFunction = (...params: any[]) => any;

  interface IXYCoord {
    x: number;
    y: number;
  }

  interface IIndexable<T> {
    [p: string]: T;
  }

  type IReactCtxValue<T extends React.Context<any>> = T extends React.Context<infer R> ? R : any;

  type IDeepReadonly<T> =
    T extends (infer R)[] ? IDeepReadonlyArray<R> :
    T extends Function ? T :
    T extends object ? IDeepReadonlyObject<T> :
    T;

  type IDeepReadonlyArray<T> = ReadonlyArray<IDeepReadonly<T>>

  type IDeepReadonlyObject<T> = {
    readonly [P in keyof T]: IDeepReadonly<T[P]>;
  };
}
