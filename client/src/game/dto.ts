export interface IObjectInfo {
  deps: string[];
  name: string;
  cost: number;
  category: string;
  time: number;
  type: "unit" | "build";
}

export interface IObject{
  object: IObjectInfo;
  status: string;
}

export interface IProgress {
  progress: number;
  name: string;
}

export interface ITickable{
  tick: (deltaTime: number) => void;
}