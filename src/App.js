import "./App.css";
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import NoMatchPage from "./NoMatchPage";
import Dashboard from "./Dashboard";
import { HashRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import NavbarTop from "./NavbarTop";
import { UserContext } from "./UserContext";
import Store from "./Store";
import ProductsPageAdmin from "./ProductsPageAdmin";

function App() {
  let [user, setUser] = useState({
    isLoggedIn: false,
    currentUserId: null,
    currentUserName: null,
    currentUserOrders: 0,
    currentUserRole: null,
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <HashRouter>
        <NavbarTop />
        <div className="container-fluid">
          <Switch>
            <Route path="/" exact={true} component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/register" component={Register} />
            <Route path="/store" component={Store} />
            <Route path="/products" component={ProductsPageAdmin} />
            <Route path="*" component={NoMatchPage} />
          </Switch>
        </div>
      </HashRouter>
    </UserContext.Provider>
  );
}

export default App;
