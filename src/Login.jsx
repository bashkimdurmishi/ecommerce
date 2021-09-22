import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
export default function Login(props) {
  const [email, setEmail] = useState("test@mail.com");
  const [password, setPassword] = useState("scott123@B");
  let userContext = useContext(UserContext);
  let [dirty, setDirty] = useState({
    email: false,
    password: false,
  });

  let [errors, setErrors] = useState({
    email: [],
    password: [],
  });

  let [message, setMessage] = useState("Hello");
  let validate = () => {
    let errorsData = {};

    /*Email Validation */
    errorsData.email = [];

    if (!email) {
      errorsData.email.push("Email can't be blank!");
    }

    const validEmailRegex =
      /(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/;
    if (email) {
      if (!validEmailRegex.test(email)) {
        errorsData.email.push("Proper email is expected");
      }
    }
    /*Email Validation */

    /*Password Validation */
    errorsData.password = [];

    if (!password) {
      errorsData.password.push("Password can't be blank!");
    }

    const validPasswordRegex =
      /(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$)/;
    if (password) {
      if (!validPasswordRegex.test(password)) {
        errorsData.password.push(
          "Password must contain a minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
        );
      }
    }
    /*Password Validation */

    setErrors(errorsData);
  };

  useEffect(validate, [email, password]);

  let onLoginClick = async () => {
    let dirtyData = dirty;
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);

    validate();

    if (isValid) {
      //get user from DB using credentials
      let response = await fetch(
        `http://localhost:5000/users?email=${email}&password=${password}`,
        { method: "GET" }
      );

      //CHange user context depending on response
      if (response.ok) {
        let responseBody = await response.json();
        if (responseBody.length > 0) {
          userContext.setUser({
            ...userContext.user,
            isLoggedIn: true,
            currentUserName: responseBody[0].fullName,
            currentUserId: responseBody[0].id,
            currentUserRole: responseBody[0].role,
          });

          //check if user or admin and redirect
          if (responseBody[0].role === "user") {
            props.history.replace("/dashboard");
          } else props.history.replace("/products");
        }
        //Handle errors
        else {
          setMessage(
            <span className="text-danger">
              User not found! Please try again or register if you dont have an
              account.
            </span>
          );
        }
      } else {
        <span className="text-danger">Unable to connect to server</span>;
      }
    }
  };

  //check if login form is valid
  let isValid = () => {
    let valid = true;
    for (let control in errors) {
      if (errors[control].length > 0) {
        valid = false;
      }
    }

    return valid;
  };
  return (
    <div className="row">
      <div className="col-lg-5 col-md-7 mx-auto">
        <div className="card border-success shadow-lg my-2">
          <div className="card-header border-bottom border-success">
            <h4
              style={{ fontSize: "40px" }}
              className="text-warning text-center"
            >
              Login
            </h4>
          </div>

          {/*Login form starts*/}
          <div className="card-body border-bottom border-success">
            {/*Get and validate email*/}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Email..."
                onBlur={(e) => {
                  setDirty({ ...dirty, email: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty["email"] && errors["email"][0] ? errors["email"] : ""}
              </div>
            </div>

            {/*Get and validate password*/}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Password..."
                onBlur={(e) => {
                  setDirty({ ...dirty, password: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty["password"] && errors["password"][0]
                  ? errors["password"]
                  : ""}
              </div>
            </div>
          </div>

          <div className="card-footer text-center">
            <div className="m-1">{message}</div>
            <button
              className="btn btn-warning text-light m-2"
              onClick={onLoginClick}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
