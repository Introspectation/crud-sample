import React, { useState, useEffect, Fragment } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CRUD = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");

  const [editID, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editSurname, setEditSurname] = useState("");
  const [editBirthday, setEditBirthday] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [nameTouched, setNameTouched] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [surnameTouched, setSurnameTouched] = useState(false);
  const [surnameError, setSurnameError] = useState(false);
  const [birthdayTouched, setBirthdayTouched] = useState(false);
  const [birthdayError, setBirthdayError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [nameTimeoutID, setNameTimeoutID] = useState(null);
  const [surnameTimeoutID, setSurnameTimeoutID] = useState(null);
  const [birthdayTimeoutID, setBirthdayTimeoutID] = useState(null);
  const [emailTimeoutID, setEmailTimeoutID] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleLogin = () => {
    if (name === "admin" && email === "admin123") {
      setLoggedIn(true);
      setUserRole("admin");
      toast.success("Logged in successfully!");
    } else if (name === "viewer" && email === "viewer123") {
      setLoggedIn(true);
      setUserRole("viewer");
      toast.success("Logged in successfully!");
    } else {
      toast.error("Invalid username or password");
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      setName("");
      setEmail("");
    }
  }, [loggedIn]);

  useEffect(() => {
    if (nameTouched) {
      if (name === "") {
        setNameError(true);
      } else {
        setNameError(false);
      }
    }
  }, [name, nameTouched]);

  useEffect(() => {
    if (surnameTouched) {
      if (surname === "") {
        setSurnameError(true);
      } else {
        setSurnameError(false);
      }
    }
  }, [surname, surnameTouched]);

  useEffect(() => {
    if (birthdayTouched) {
      if (birthday === "") {
        setBirthdayError(true);
      } else {
        setBirthdayError(false);
      }
    }
  }, [birthday, birthdayTouched]);

  useEffect(() => {
    if (emailTouched) {
      if (email === "") {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  }, [email, emailTouched]);

  useEffect(() => {
    if (!nameError && nameTimeoutID) {
      clearTimeout(nameTimeoutID);
      setNameTouched(false);
      setNameTimeoutID(null);
    }
  }, [nameError, nameTimeoutID]);

  const validateInputs = (name, surname, birthday, email) => {
    if (!name || !surname || !birthday || !email) {
      return false;
    }
    return true;
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("https://localhost:7182/api/Students")
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
  if(userRole === 'admin') {
    handleShow();
    axios
      .get(`https://localhost:7182/api/Students/${id}`)
      .then((result) => {
        setEditName(result.data.name);
        setEditSurname(result.data.surname);
        setEditEmail(result.data.email);
        setEditBirthday(result.data.birthday);
        setEditId(id);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      axios
        .delete(`https://localhost:7182/api/Students/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Student has been deleted");
            getData();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleUpdate = () => {
    if (validateInputs(editName, editSurname, editBirthday, editEmail)) {
      const url = `https://localhost:7182/api/Students/${editID}`;
      const data = {
        id: editID,
        name: editName,
        surname: editSurname,
        birthday: editBirthday,
        email: editEmail,
      };
      axios
        .put(url, data)
        .then((result) => {
          handleClose();
          getData();
          clear();
          toast.success("Student has been updated");
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      toast.error("All fields must be filled!");
    }
  };

  const handleSave = () => {
    if (validateInputs(name, surname, birthday, email)) {
      const url = "https://localhost:7182/api/Students";
      const data = {
        name: name,
        surname: surname,
        birthday: birthday,
        email: email,
      };
      axios
        .post(url, data)
        .then((result) => {
          getData();
          clear();
          toast.success("Student has been added");
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      toast.error("All fields must be filled!!!");
    }
  };

  const clear = () => {
    setName("");
    setSurname("");
    setBirthday("");
    setEmail("");
    setEditName("");
    setEditSurname("");
    setEditBirthday("");
    setEditEmail("");
    setEditId("");
    setNameTouched(false);
    setSurnameTouched(false);
    setBirthdayTouched(false);
    setEmailTouched(false);
  };

  return (
    <Fragment>
      {!loggedIn && ( 
        <Fragment>
                  <h1 style={{ textAlign: "center" }}>LOGIN</h1>

          <ToastContainer />
          <Container>
            <Row>
              <Col>
                <input
                  type="text"
                  className="form-control"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => {
                    setNameTouched(true);
                    const timeoutID = setTimeout(
                      () => setNameTouched(false),
                      6000
                    );
                    setNameTimeoutID(timeoutID);
                  }}
                  style={{ borderColor: nameError ? "red" : "" }}
                />
              </Col>
              <Col>
                <input
                  type="password"
                  className="form-control"
                  placeholder="mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  style={{ borderColor: emailError ? "red" : "" }}
                />
              </Col>
              <Col>
                <button className="btn btn-primary" onClick={handleLogin}>
                  Login
                </button>
              </Col>
            </Row>
          </Container>
        </Fragment>
      )}

      {loggedIn && (
        <Fragment>
          <h1 style={{ textAlign: "center" }}>STUDENT REGISTER</h1>
          <ToastContainer />
          <Container>
            <Row>
              <Col>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setNameTouched(true)}
                  style={{ borderColor: nameError ? "red" : "" }}
                />
              </Col>
              <Col>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  onBlur={() => setSurnameTouched(true)}
                  style={{ borderColor: surnameError ? "red" : "" }}
                />
              </Col>
              <Col>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter birthday"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  onBlur={() => setBirthdayTouched(true)}
                  style={{ borderColor: birthdayError ? "red" : "" }}
                />
              </Col>
              <Col>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  style={{ borderColor: emailError ? "red" : "" }}
                />
              </Col>
              <Col>
                <button className="btn btn-primary" onClick={handleSave}>
                  Submit
                </button>
              </Col>
            </Row>
          </Container>
          <br></br>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>name</th>
                <th>surname</th>
                <th>birthday</th>
                <th>email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.surname}</td>
                      <td>{item.birthday}</td>
                      <td>{item.email}</td>
                      <td colSpan={2}>
                        {userRole === 'admin' && (<><button
                          className="btn btn-primary"
                          onClick={() => handleEdit(item.id)}
                        >
                          Edit
                        </button>{" "}
                        &nbsp;
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button></>)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>Loading...</td>
                </tr>
              )}
            </tbody>
          </Table>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modify / Update Student</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </Col>
                <Col>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter surname"
                    value={editSurname}
                    onChange={(e) => setEditSurname(e.target.value)}
                  />
                </Col>
                <Col>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter birthday"
                    value={editBirthday}
                    onChange={(e) => setEditBirthday(e.target.value)}
                  />
                </Col>
                <Col>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Fragment>
      )}
    </Fragment>
  );
};

export default CRUD;
