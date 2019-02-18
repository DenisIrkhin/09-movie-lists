import { createStore } from "redux";

let reducer = function(state, action) {
    console.log("dispatch triggered")
  switch (action.type) {
    case "login":
    console.log("action login used")
    return {...state,state:{...state.state,loggedIn:true,user:action.payload}}


    case "logout":
    console.log("action logout used")

    return {...state,state:{...state.state,loggedIn:false,user:"not logged in"}}
      

    case "getLists":
    console.log("action getLists used")
      return {...state,state:{...state.state,lists:action.payload}}

    default:
      return { state };
  }
};
const initialState = {loggedIn:false};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
