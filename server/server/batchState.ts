class BatchState<DataType>{
  private batch:Array<(lastState:DataType)=>DataType> = [];
  private data:DataType;

  onUpdate:(data:DataType)=>void;

  constructor(){
    
  }

  getState(){
    return this.data;
  }

  setState(setter:(lastState:DataType)=>DataType){
    //dont mutate lastState in setter;
    const isEmpty = this.batch.length==0;
    this.batch.push(setter);

    //internal ticker, choise one of
    if (isEmpty){
      setTimeout(()=>{
        this._update();
      }, 0);
    }
  }

  //external ticker, choise one of
  tick(){
    if(this.batch.length){
      this._update();
    }
  }

  private _update(){
    this.data = this.batch.reduce((current, setter)=>{
      return setter(current);
    }, this.data); 
    this.batch = [];
    this.onUpdate(this.data);
  }
}

  setState(value:DataType | ((lastState:DataType)=>DataType)){
    if (value instanceof Function){
      this._setState(value);
    } else {
      this._setState(()=>value);
    }
  }