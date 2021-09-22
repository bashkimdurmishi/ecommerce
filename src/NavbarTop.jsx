import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { NavLink } from "react-router-dom";

export default function NavbarTop() {
  let userContext = useContext(UserContext);

  let onLogoutClick = (e) => {
    e.preventDefault();
    userContext.setUser({
      isLoggedIn: false,
      currentUserName: null,
      currentUserId: null,
      currentUserOrders: 0,
      currentUserRole: null,
    });

    window.location.hash = "/";
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="#">
          eCommerce
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {userContext.user.isLoggedIn &&
            userContext.user.currentUserRole === "user" ? (
              <>
                <li className="nav-item position-relative me-3">
                  <NavLink
                    className="nav-link "
                    aria-current="page"
                    to="/dashboard"
                    activeClassName="active"
                  >
                    <i className="fa fa-dashboard"></i> Dashboard
                    <span className="order-number position-relative top-10 start-10 translate-middle badge rounded-pill bg-danger ">
                      {userContext.user.currentUserOrders}
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    aria-current="page"
                    to="/store"
                    activeClassName="active"
                  >
                    <i className="fa fa-shopping-bag"></i> Store
                  </NavLink>
                </li>
              </>
            ) : userContext.user.isLoggedIn &&
              userContext.user.currentUserRole === "admin" ? (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/products"
                  exact={true}
                  activeClassName="active"
                >
                  <i className="fa fa-shopping-bag"></i> Products
                </NavLink>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    aria-current="page"
                    to="/"
                    exact={true}
                    activeClassName="active"
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    aria-current="page"
                    to="/register"
                    activeClassName="active"
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}

            <div style={{ position: "absolute", right: 70 }}>
              <ul className="navbar-nav d-flex">
                {userContext.user.isLoggedIn ? (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="/#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-user-circle">
                        {userContext.user.currentUserName}
                      </i>
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <a
                          className="dropdown-item"
                          href="/#"
                          onClick={onLogoutClick}
                        >
                          Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : null}
              </ul>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}
