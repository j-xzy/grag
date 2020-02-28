declare namespace IGrag {
  interface ICompOption {
    allowChild?: boolean;
    width?: number;
    height?: number;
    img?: string;
  }

  interface ICompInfo {
    option: ICompOption;
    Component: ICompFcClass;
  }

  interface ICompInfos {
    [compId: string]: ICompInfo;
  }

  interface IDomMap {
    [ftrid: string]: HTMLElement;
  }

  interface IRootMap {
    [canvasId: string]: IGrag.INode;
  }

  interface IFtrStyle {
    width: number;
    height: number;
    x: number;
    y: number;
  }

  interface IAuxiliaryState {
    ht: number;
    hm: number;
    hb: number;
    vl: number;
    vm: number;
    vr: number;
  }

  type IFtrState = IFtrStyle & IAuxiliaryState;

  interface IProviderConfig {
    color?: string;
    id?: string;
  }

  interface IHighLightState {
    ftrId: string;
    id: string;
    color: string;
  }
}
