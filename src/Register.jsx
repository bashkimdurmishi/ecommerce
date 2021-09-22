import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

export default function Register(props) {
  let [state, setState] = useState({
    email: "",
    password: "",
    fullName: "",
    dateOfBirth: "",
    country: "",
    gender: "",
  });

  let [errors, setErrors] = useState({
    email: [],
    password: [],
    fullName: [],
    dateOfBirth: [],
    country: [],
    gender: [],
  });
  let [dirty, setDirty] = useState({
    email: false,
    password: false,
    fullName: false,
    dateOfBirth: false,
    country: false,
    gender: false,
  });

  const [countries] = useState([
    { id: 1, countryName: "USA" },
    { id: 2, countryName: "Japan" },
    { id: 3, countryName: "India" },
    { id: 4, countryName: "Albania" },
    { id: 5, countryName: "UK" },
    { id: 6, countryName: "France" },
    { id: 7, countryName: "Italy" },
  ]);

  let [message, setMessage] = useState("");
  let userContext = useContext(UserContext);
  let validate = () => {
    let errorsData = [];

    /*Email Validation */
    errorsData.email = [];

    if (!state.email) {
      errorsData.email.push("Email can't be blank!");
    }

    const validEmailRegex =
      /(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/;
    if (state.email) {
      if (!validEmailRegex.test(state.email)) {
        errorsData.email.push("Proper email is expected");
      }
    }
    /*Email Validation */

    /*Password Validation */
    errorsData.password = [];

    if (!state.password) {
      errorsData.password.push("Password can't be blank!");
    }

    const validPasswordRegex =
      /(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$)/;
    if (state.password) {
      if (!validPasswordRegex.test(state.password)) {
        errorsData.password.push(
          "Password must contain a minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
        );
      }
    }
    /*Password Validation */

    /*other Validations */
    errorsData.fullName = [];
    if (!state.fullName) {
      errorsData.fullName.push("Name can't be blank!");
    }

    //gender
    errorsData.gender = [];
    if (!state.gender) {
      errorsData.gender.push("Gender can't be blank!");
    }

    //country
    errorsData.country = [];
    if (!state.country) {
      errorsData.country.push("Country can't be blank!");
    }

    //date of birth
    errorsData.dateOfBirth = [];
    if (!state.dateOfBirth) {
      errorsData.dateOfBirth.push("Date of birth can't be blank!");
    }

    setErrors(errorsData);
  };

  useEffect(validate, [state]);

  let onRegisterClick = async () => {
    let dirtyData = dirty;
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });

    setDirty(dirtyData);
    validate();

    if (isValid()) {
      let response = await fetch("http://localhost:5000/users", {
        method: "POST",
        body: JSON.stringify({
          email: state.email,
          password: state.password,
          fullName: state.fullName,
          dateOfBirth: state.dateOfBirth,
          gender: state.gender,
          country: state.country,
          role: "user",
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        let responseBody = await response.json();
        userContext.setUser({
          ...userContext.user,
          isLoggedIn: true,
          currentUserName: responseBody.fullName,
          currentUserId: responseBody.id,
          currentUserRole: responseBody.role,
        });
        setMessage(<span className="text-success">Success</span>);
        props.history.replace("/dashboard");
      }
    } else {
      setMessage(<span className="text-danger">Error</span>);
    }
  };

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
    <div className="col-lg-4 mx-auto">
      <div className="card border-primary shadow my-2">
        <div className="card-header border-bottom border-primary">
          <h4
            className="text-center text-warning my-3"
            style={{ fontSize: "40px" }}
          >
            Register
          </h4>
          {/*<ul className="text-danger">
            {Object.keys(errors).map((control) => {
              if (dirty[control]) {
                return errors[control].map((err) => {
                  return <li key={err}>{err}</li>;
                });
              } else {
                return "";
              }
            })}
          </ul>*/}
        </div>

        <div className="card-body border-bottom border-primary">
          {/*email*/}
          <div
            className="form-group row align-items-center my-1"
            htmlFor="email"
          >
            <div className="col-lg-4 ">
              <label>Email</label>
            </div>
            <div className="col-lg-8">
              <input
                type="text"
                className="form-control"
                name="email"
                id="email"
                value={state.email}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.value })
                }
                onBlur={(e) => {
                  setDirty({ ...dirty, [e.target.name]: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty["email"] && errors["email"][0] ? errors["email"] : ""}
              </div>
            </div>
          </div>
          {/*email ends*/}

          {/*password*/}
          <div
            className="form-group row align-items-center my-1"
            htmlFor="password"
          >
            <div className="col-lg-4">
              <label>Password</label>
            </div>
            <div className="col-lg-8">
              <input
                type="password"
                className="form-control"
                name="password"
                value={state.password}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.value })
                }
                onBlur={(e) => {
                  setDirty({ ...dirty, [e.target.name]: true });
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
          {/*password ends*/}

          {/*fullName*/}
          <div
            className="form-group row align-items-center my-1"
            htmlFor="fullName"
          >
            <div className="col-lg-4">
              <label>Full Name</label>
            </div>
            <div className="col-lg-8">
              <input
                type="text"
                className="form-control"
                name="fullName"
                id="fullName"
                value={state.fullName}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.value })
                }
                onBlur={(e) => {
                  setDirty({ ...dirty, [e.target.name]: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty["fullName"] && errors["fullName"][0]
                  ? errors["fullName"]
                  : ""}
              </div>
            </div>
          </div>
          {/*fullName ends*/}

          {/*dateOfBirth*/}
          <div
            className="form-group row align-items-center my-1"
            htmlFor="dateOfBirth"
          >
            <div className="col-lg-4">
              <label>Date of birth</label>
            </div>
            <div className="col-lg-8">
              <input
                type="date"
                className="form-control"
                name="dateOfBirth"
                id="dateOfBirth"
                value={state.dateOfBirth}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.value })
                }
                onBlur={(e) => {
                  setDirty({ ...dirty, [e.target.name]: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty["dateOfBirth"] && errors["dateOfBirth"][0]
                  ? errors["dateOfBirth"]
                  : ""}
              </div>
            </div>
          </div>
          {/*dateOfBirth ends*/}

          {/*gender*/}
          <div className="form-group row align-items-center my-1">
            <div className="col-lg-4">
              <label>Gender</label>
            </div>
            <div className="col-lg-8">
              <div className="form-check">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  id="male"
                  className="form-check-input"
                  checked={state.gender === "male" ? true : false}
                  onChange={(e) =>
                    setState({ ...state, [e.target.name]: e.target.value })
                  }
                  onBlur={(e) => {
                    setDirty({ ...dirty, [e.target.name]: true });
                    validate();
                  }}
                />
                <label htmlFor="male" className="form-check-inline">
                  Male
                </label>
              </div>

              <div className="form-check">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  id="female"
                  className="form-check-input"
                  checked={state.gender === "female" ? true : false}
                  onChange={(e) =>
                    setState({ ...state, [e.target.name]: e.target.value })
                  }
                  onBlur={(e) => {
                    setDirty({ ...dirty, [e.target.name]: true });
                    validate();
                  }}
                />
                <label htmlFor="female" className="form-check-inline">
                  Female
                </label>
              </div>
              <div className="text-danger">
                {dirty["gender"] && errors["gender"][0] ? errors["gender"] : ""}
              </div>
            </div>
          </div>
          {/*gender ends*/}

          {/*country*/}
          <div
            className="form-group row align-items-center my-1"
            htmlFor="dateOfBirth"
          >
            <div className="col-lg-4 ">
              <label>Country</label>
            </div>
            <div className="col-lg-8">
              <select
                type="date"
                className="form-control"
                name="country"
                id="country"
                value={state.country}
                onChange={(e) =>
                  setState({ ...state, [e.target.name]: e.target.value })
                }
                onBlur={(e) => {
                  setDirty({ ...dirty, [e.target.name]: true });
                  validate();
                }}
              >
                <option value="">--Select Country--</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.countryName}
                  </option>
                ))}
              </select>
              <div className="text-danger">
                {dirty["country"] && errors["country"][0]
                  ? errors["country"]
                  : ""}
              </div>
            </div>
          </div>
          {/*country ends*/}
        </div>
        <div className="card-footer text-center">
          <div className="m-1">{message}</div>
          <div>
            <button
              className="btn btn-warning text-light m-2"
              onClick={onRegisterClick}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
