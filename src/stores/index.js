import AppStore from "./appStore";
const fetcher = url => window.fetch(url).then(response => response.json());

const store = {
  app: new AppStore(fetcher)
};

export default store;
