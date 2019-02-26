import { createStore } from "redux";

let reducer = function(state, action) {
  console.log("dispatch triggered");
  switch (action.type) {
    case "login":
      console.log("action login used");
      return {
        ...state,
        state: { ...state.state, loggedIn: true, user: action.payload.email,userId:action.payload.userId }
      };

    case "logout":
      if (document.cookie.includes("__sid__")) {
        document.cookie = '__sid__=""';
        // document.location.reload()
      }
      // document.location.reload()
      console.log("action logout used");
      return {
        ...state,
        state: { ...state.state, loggedIn: false, user: "not logged in",lists:[] }
      };

    case "getLists":
      console.log("action getLists used");
      return { ...state, state: { ...state.state, lists: action.payload } };

    case "searchList":
      console.log("action searchList used");
      return {
        ...state,
        state: { ...state.state, searchListQuery: action.payload }
      };

    case "editList":
      console.log("action editList used");
      return {
        ...state,
        state: { ...state.state, editList: action.payload }
      };
    default:
      return { state };
  }
};
const initialState = { loggedIn: false };

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
