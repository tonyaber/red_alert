class BatchConnection implements IConnection{
  private batch:Array<string> = [];
  private connection: IConnection;

  onMessage:(message:string)=>void;

  constructor(connection:IConnection){
    this.connection = connection;
    this.connection.onMessage = (batchMsg:string)=>{
      const batch:Array<string> = JSON.parse(batchMsg);
      batch.forEach(message=>{
        this.onMessage(message);
      })
    }
  }

  sendUTF(message:string){
    const isEmpty = this.batch.length==0;
    this.batch.push(message);
    if (isEmpty){
      setTimeout(()=>{
        this._send(JSON.stringify(this.batch));
        this.batch = [];
      }, 0);
    }
  }

  private _send(batchMsg:string){
    this.connection.sendUTF(batchMsg);
  }
}