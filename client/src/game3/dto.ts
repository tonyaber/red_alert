
export interface IGameObjectData{
  id: string;
  type: string;
  content: string; // or all fields
}

export interface IGameUpdateRespone{
  type: 'update' | 'delete' | 'create';
  data: IGameObjectData;
}