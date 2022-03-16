import React, { Component } from "react";
import swal from "sweetalert";
import { Checkbox, Button, TextField, Link } from "@material-ui/core";
const axios = require("axios");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  login = () => {
    const pwd = bcrypt.hashSync(this.state.password, salt);

    axios
      .post("http://localhost:2000/login", {
        email: this.state.email,
        password: pwd,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_id", res.data.id);
        this.props.history.push("/dashboard");
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.data &&
          err.response.data.errorMessage
        ) {
          swal({
            text: err.response.data.errorMessage,
            icon: "error",
            type: "error",
          });
        }
      });
  };

  render() {
    return (
      <div style={{ marginTop: "200px" }}>
        <div className="myform">
          <h1 className="title">Login</h1>
          <p className="tag">Get started for free</p>
          <br />
          <TextField
            className="textfield"
            id="outlined-basic"
            variant="outlined"
            label="email"
            type="email"
            autoComplete="off"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            placeholder="email"
            required
          />
          <br />
          <br />
          <TextField
            className="textfield"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            required
          />
          <br />
          <br />
          <div className="checkbox">
            <Checkbox
              style={{
                color: "#3954ac",
              }}
              {...label}
              defaultChecked
            />
            <p>I accept the terms and conditions</p>
          </div>

          <Button
            className="btn"
            variant="contained"
            color="primary"
            disabled={this.state.email == "" && this.state.password == ""}
            onClick={this.login}
          >
            Login
          </Button>
          <br />
          <br />
          <Link className="link" href="/register">
            Create an account
          </Link>
        </div>
      </div>
    );
  }
}
