declare namespace IGrag {
  type ICompFcClass = React.FC | React.ComponentClass;

  type IMap2Func<M> = {
    [p in keyof M]: (params: M[p]) => void;
  };

  interface IId2CompMap {
    [id: string]: ICompFcClass;
  }
}