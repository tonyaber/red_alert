export interface IGameObjectData{
  id: string;
  type: string;
  content: string; // or all fields
}

interface IObject {
  deps: string[],
  name: string,
  cost: number,
 }
export interface IObjectInfo {
  object: IObject,
  status: string,
  progress: number,
}