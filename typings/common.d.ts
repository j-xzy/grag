declare namespace IGrag {
  type ICompFcClass = React.FC | React.ComponentClass;

  type IMap2Func<M> = {
    [p in keyof M]: (params: M[p]) => void;
  };

  interface ICompMap {
    [id: string]: ICompFcClass;
  }
}