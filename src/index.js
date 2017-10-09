import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

// Mobx
import store from "stores";
import { Provider } from "mobx-react";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();

// if (module.hot) {
//   module.hot.accept(() => {
//     ReactDOM.render(
//       <Provider store={store}>
//         <App />
//       </Provider>,
//       document.getElementById("root")
//     );
//   });
// }
