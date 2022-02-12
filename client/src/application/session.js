const SESSIONSTORENAME = "session-redalert";
class Session {
  constructor() {
    this.load();
  }
  get id() {
    return this.store.id;
  }
  get object() {
    if(this.store===undefined) this.load();
    return this.store;
  }
  has(propID) {
    return typeof this.store[propID] !== "undefined";
  }
  set(propID, value) {
    this.store[propID] = value;
  }
  get(propID) {
    return this.store[propID];
  }
  load() {
    const str = sessionStorage.getItem(SESSIONSTORENAME);
    if (!str) {
      this.store = { id: this.uuid() };
      this.save();
    } else {
      this.store = JSON.parse(str);
    }
  }
  save() {
    sessionStorage.setItem(SESSIONSTORENAME, JSON.stringify(this.store));
  }
  uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
}

const session = new Session();
export default session;
