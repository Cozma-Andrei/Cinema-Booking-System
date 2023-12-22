import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Modal } from "react-bootstrap";
import { useState } from "react";
import Swal from 'sweetalert2';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "Email": email,
          "Password": password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      } else {
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));
        Swal.fire({
          icon: 'success',
          title: 'Login successful!',
          text: 'Welcome back!',
        });
        setEmail('');
        setPassword('');
        setError('');
        props.onHide();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          {error && <div className="text-danger mb-3">{error}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Login;
