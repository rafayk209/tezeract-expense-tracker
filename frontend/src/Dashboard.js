import React, { Component } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  LinearProgress,
  DialogTitle,
  DialogContent,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import "./dashboard.css";
import swal from "sweetalert";
const axios = require("axios");

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      openProductModal: false,
      openProductEditModal: false,
      id: "",
      type: "",
      category: "",
      date: "",
      amount: "",
      account: "",
      file: "",
      fileName: "",
      page: 1,
      search: "",
      products: [],
      pages: 0,
      loading: false,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getProduct();
      });
    }
  };

  getProduct = () => {
    this.setState({ loading: true });

    let data = "?";
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios
      .get(`http://localhost:2000/get-product${data}`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({
          loading: false,
          products: res.data.products,
          pages: res.data.pages,
        });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        this.setState({ loading: false, products: [], pages: 0 }, () => {});
      });
  };

  deleteProduct = (id) => {
    axios
      .post(
        "http://localhost:2000/delete-product",
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: this.state.token,
          },
        }
      )
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        this.setState({ page: 1 }, () => {
          this.pageChange(null, 1);
        });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
      });
  };

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getProduct();
    });
  };

  logOut = () => {
    localStorage.setItem("token", null);
    this.props.history.push("/");
  };

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => {});
    }
    this.setState({ [e.target.name]: e.target.value }, () => {});
    if (e.target.name == "search") {
      this.setState({ page: 1 }, () => {
        this.getProduct();
      });
    }
  };

  addProduct = () => {
    const file = new FormData();
    file.append("type", this.state.type);
    file.append("category", this.state.category);
    file.append("amount", this.state.amount);
    file.append("account", this.state.account);
    file.append("date", this.state.date);

    axios
      .post("http://localhost:2000/add-product", file, {
        headers: {
          "content-type": "multipart/form-data",
          token: this.state.token,
        },
      })
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        this.handleProductClose();
        this.setState(
          {
            type: "",
            category: "",
            amount: "",
            account: "",
            file: null,
            page: 1,
          },
          () => {
            this.getProduct();
          }
        );
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        this.handleProductClose();
      });
  };

  updateProduct = () => {
    const file = new FormData();
    file.append("id", this.state.id);
    file.append("type", this.state.type);
    file.append("category", this.state.category);
    file.append("account", this.state.account);
    file.append("amount", this.state.amount);

    axios
      .post("http://localhost:2000/update-product", file, {
        headers: {
          "content-type": "multipart/form-data",
          token: this.state.token,
        },
      })
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        this.handleProductEditClose();
        this.setState(
          { type: "", category: "", account: "", amount: "" },
          () => {
            this.getProduct();
          }
        );
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        this.handleProductEditClose();
      });
  };

  handleProductOpen = () => {
    this.setState({
      openProductModal: true,
      id: "",
      type: "",
      category: "",
      amount: "",
      account: "",
    });
  };

  handleProductClose = () => {
    this.setState({ openProductModal: false });
  };

  handleProductEditOpen = (data) => {
    this.setState({
      openProductEditModal: true,
      id: data._id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      account: data.account,
    });
  };

  handleProductEditClose = () => {
    this.setState({ openProductEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Expense Tracker App</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProductOpen}
          >
            + Add
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        <Dialog
          open={this.state.openProductEditModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit Tracsaction</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="type"
              value={this.state.type}
              onChange={this.onChange}
              placeholder="Tracsaction type"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="category"
              value={this.state.category}
              onChange={this.onChange}
              placeholder="category"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="amount"
              value={this.state.amount}
              onChange={this.onChange}
              placeholder="amount"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="account"
              value={this.state.account}
              onChange={this.onChange}
              placeholder="account"
              required
            />
            <br />
            <br />

            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={
                this.state.type == "" ||
                this.state.category == "" ||
                this.state.account == "" ||
                this.state.amount == ""
              }
              onClick={(e) => this.updateProduct()}
              color="primary"
              autoFocus
            >
              Edit Product
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.openProductModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">+ Add </DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="type"
              value={this.state.type}
              onChange={this.onChange}
              placeholder="Transaction type"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="category"
              value={this.state.category}
              onChange={this.onChange}
              placeholder="category"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="amount"
              value={this.state.amount}
              onChange={this.onChange}
              placeholder="amount"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="account"
              value={this.state.account}
              onChange={this.onChange}
              placeholder="account"
              required
            />
            <br />
            <br />
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={
                this.state.type == "" ||
                this.state.category == "" ||
                this.state.account == "" ||
                this.state.amount == "" ||
                this.state.file == null
              }
              onClick={(e) => this.addProduct()}
              color="primary"
              autoFocus
            >
              + Add
            </Button>
          </DialogActions>
        </Dialog>

        <br />
        <div className="headbtn">
          <div className="headbtn1">
            <p className="txt">TotalAmount</p>
            <Button className="large" variant="contained">
              PKR 10,000
            </Button>
          </div>
          <div className="headbtn2">
            <p className="txt">Accounts</p>
            <Button onClick={this.cash} className="small" variant="contained">
              PKR 5000
            </Button>
            <br />
            <br />
            <Button onClick={this.bank} className="small" variant="contained">
              PKR 5000
            </Button>
          </div>
        </div>

        <TableContainer className="table">
          {/* <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Search by product name"
            required
          /> */}
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Transaction type</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Account</TableCell>
                <TableCell align="center">Date/Time</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.products.map((row) => (
                <TableRow key={row.type}>
                  <TableCell align="center" component="th" scope="row">
                    {row.type}
                  </TableCell>

                  <TableCell align="center">{row.category}</TableCell>
                  <TableCell align="center">{row.amount}</TableCell>
                  <TableCell align="center">{row.account}</TableCell>
                  <TableCell align="center">{row.date}</TableCell>
                  <TableCell align="center">
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.handleProductEditOpen(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteProduct(row._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          {/* <Pagination
            count={this.state.pages}
            page={this.state.page}
            onChange={this.pageChange}
            color="primary"
          /> */}
        </TableContainer>
      </div>
    );
  }
}
