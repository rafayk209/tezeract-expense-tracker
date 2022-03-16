import React, { Component } from "react";
import swal from "sweetalert";
import { Checkbox, Button, TextField, Link } from "@material-ui/core";
const axios = require("axios");

const label = { inputProps: { "aria-label": "Checkbox demo" } };
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = () => {
    axios
      .post("http://localhost:2000/register", {
        email: this.state.email,
        //username: this.state.username,
        password: this.state.password,
      })
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });
        this.props.history.push("/");
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
      });
  };

  render() {
    return (
      <div className="maindiv" style={{ marginTop: "200px" }}>
        <div className="myform">
          <h1 className="title">Sign up</h1>
          <p className="tag">Get started for free</p>
          <TextField
            className="textfield"
            id="outlined-basic"
            label="email"
            variant="outlined"
            type="email"
            autoComplete="off"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            required
          />
          <br />
          <br />
          <TextField
            className="textfield"
            id="outlined-basic"
            label="Username"
            variant="outlined"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
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
            onClick={this.register}
          >
            SIGN UP
          </Button>
          <br />
          <br />
          <Link href="/">already have an account? Login</Link>
        </div>

      </div>
    );
  }
}
