const SESSIONSTORENAME = "session-redalert";

interface IStoreUser {
  name:string;
}
enum IStoreKey {
  id = 'id',
  user = 'user',
}
type TStoreKey = 'id' | 'user';
interface IStore {
  id: string ;
  user: IStoreUser;
}
class Session {
  store: IStore;
  constructor() {
    this.load();
  }
  get id() {
    return this.store.id;
  }
  get user() {
    return this.store.user;
  }
  set user(u:IStoreUser) {
    this.store.user=u;
  }
  get object() {
    if(this.store===undefined) this.load();
    return this.store;
  }
  has(propID:TStoreKey) {
    return typeof this.store[propID] !== "undefined";
  }
  load():void {
    const str = sessionStorage.getItem(SESSIONSTORENAME);
    if (!str) {
      this.store = { id: this.uuid(), user:{name:'unknow'}};
      this.save();
    } else {
      this.store = JSON.parse(str);
    }
  }
  save():void {
    sessionStorage.setItem(SESSIONSTORENAME, JSON.stringify(this.store));
  }
  uuid():string {
    return ('10000000' + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        Number(c)^(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
      ).toString(16)
    );
  }
}

const session = new Session();
export default session;
export {IStoreUser}
