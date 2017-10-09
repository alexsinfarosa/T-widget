import { observable } from "mobx";

export default class appStore {
  constructor(fetch) {
    this.fetch = fetch;
  }
  @observable isLoading = false;
}
