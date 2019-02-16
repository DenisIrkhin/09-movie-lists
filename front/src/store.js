import { createStore } from "redux";

let reducer = function(state, action) {
    console.log("dispatch triggered")
  switch (action.type) {
    case "login":
    console.log("action login used")
      return { ...state, loggedIn: true };

    case "logout":
    console.log("action logout used")

      return { ...state, loggedIn: false };

    default:
      return { state };
  }
};
const initialState = {};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
