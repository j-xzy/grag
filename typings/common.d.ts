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

  interface ISize {
    width: number;
    height: number;
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

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface ObjectConstructor {
  /**
   * Returns the names of the enumerable string properties and methods of an object.
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  keys<T extends object>(o: T): Array<keyof T>;
}
