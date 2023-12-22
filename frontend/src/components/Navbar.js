import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Image } from "react-bootstrap";
import logo from "./logo.png";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function CustomNavbar() {
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [registerModalShow, setRegisterModalShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/">
            <Image
              src={logo}
              alt="Logo"
              width="50"
              height="50"
              className="d-inline-block"
            />{' '}
            TicketEase
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav>
              {isLoggedIn === false ? (
                <>
                  <Nav.Link href="#login" onClick={() => setLoginModalShow(true)}>Login</Nav.Link>
                  <Nav.Link href="#register" onClick={() => setRegisterModalShow(true)}>Register</Nav.Link>
                </>
              ) : (
                <Nav.Link href="#logout" onClick={() => setLoginModalShow(true)}>Logout</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Login show={loginModalShow} onHide={() => setLoginModalShow(false)} />
      <Register show={registerModalShow} onHide={() => setRegisterModalShow(false)} />
    </div>
  );
}

export default CustomNavbar;