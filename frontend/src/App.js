import './App.css';
import MovieCard from './components/MovieCard';
import Navbar from "./components/Navbar";
import { Container, Row, Col, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [movies, setMovies] = useState([]);
  const [userPage, setUserPage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    Name: '',
    Categories: [],
    Duration: '',
    Hour: '',
    Image_url: '',
    Day: selectedDay
  });
  const [selectedMovieToDelete, setSelectedMovieToDelete] = useState(null);

  useEffect(() => {
    const currentDayIndex = (new Date().getDay() + 1) % 7;

    const reorderedDays = [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ].slice(currentDayIndex, 7).concat([
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ].slice(0, currentDayIndex));

    setDaysOfWeek(reorderedDays);
    setSelectedDay(reorderedDays[0]);
  }, []);

  useEffect(() => {
    if (selectedDay) {
      fetchMoviesByDay(selectedDay);
    }

    setNewMovie({
      Name: '',
      Categories: [],
      Duration: '',
      Hour: '',
      Image_url: '',
      Day: selectedDay
    });
  }, [selectedDay, isAdmin, userPage]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handlePageReservations = () => {
    setIsAdmin(false);
    setUserPage(true);
    fetchMoviesByDay(selectedDay);
  };

  const handlePageAdmin = () => {
    setIsAdmin(true);
    setUserPage(false);
    fetchMoviesByDay(selectedDay);
  };

  const handleAddMovie = () => {
    setShowAddMovieModal(true);
  };

  const handleCloseAddMovieModal = () => {
    setShowAddMovieModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Categories') {
      const categoriesArray = value.split(',').map(item => item.trim());
      setNewMovie(prevState => ({
        ...prevState,
        [name]: categoriesArray
      }));
    } else {
      setNewMovie(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleAddMovieSubmit = (e) => {
    e.preventDefault();
    addMovie(newMovie);
  };

  const handleDeleteMovie = (movieId) => {
    setSelectedMovieToDelete(movieId);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteMovie = () => {
    deleteMovie(selectedMovieToDelete);
    setSelectedMovieToDelete(null);
    setShowDeleteModal(false);
    fetchMoviesByDay(selectedDay);
  };

  const handleCancelDeleteMovie = () => {
    setSelectedMovieToDelete(null);
    setShowDeleteModal(false);
  };

  const fetchMoviesByDay = async (day) => {
    try {
      if (userPage) {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:5000/get_movies_by_person', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Mode': 'no-cors',
          },
          body: JSON.stringify({ Day: day }),
        });

        if (response.ok) {
          const data = await response.json();
          setMovies(data.movies);
        } else {
          console.error('Error fetching movies');
        }
      }

      else if (!userPage) {
        const response = await fetch('http://localhost:5000/get_movies_by_day', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Mode': 'no-cors',
          },
          body: JSON.stringify({ Day: day }),
        });

        if (response.ok) {
          const data = await response.json();
          setMovies(data.movies);
        } else {
          console.error('Error fetching movies');
        }
      }
    } catch (error) {
      console.error('Error fetching movies', error);
    }
  };

  const addMovie = async (movie) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/add_movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Mode': 'no-cors',
        },
        body: JSON.stringify(movie),
      });

      const data = await response.json();

      if (response.ok) {
        setShowAddMovieModal(false);
        setNewMovie({
          Name: response,
          Categories: [],
          Duration: '',
          Hour: '',
          Image_url: '',
          Day: selectedDay
        });
        await fetchMoviesByDay(selectedDay);

        Swal.fire({
          icon: 'success',
          title: 'Movie added successfully!',
          text: `You have added ${data.name} at ${data.hour}.`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: data.error,
        });
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const deleteMovie = async (movieId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/delete_movie/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Mode': 'no-cors',
        },
      });

      const data = await response.json();

      if (response.ok) {
        await fetchMoviesByDay(selectedDay);

        Swal.fire({
          icon: 'success',
          title: 'Movie deleted successfully!',
          text: `You have deleted ${data.name} which was at ${data.hour}.`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: data.error,
        });
      }
    } catch (error) {
      console.error('Error deleting movie', error);
    }
  };

  return (
    <div className="App">
      <Navbar goPageReservations={handlePageReservations} goPageAdmin={handlePageAdmin} />
      <Container className="d-flex flex-column align-items-center text-center">
        <Row className="mt-3 mb-3 justify-content-center" style={{ width: "100%" }}>
          {daysOfWeek.map((day, index) => (
            <Col key={index} xs={12} className="mb-2">
              <Button
                variant={selectedDay === day ? "primary" : "outline-primary"}
                style={{ width: "50%" }}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </Button>
            </Col>
          ))}
        </Row>

        {isAdmin && (
          <Row className="justify-content-center mb-3">
            <Col xs={12}>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="delete-movie-dropdown">
                  Delete Movie
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {movies.map((movie, index) => (
                    <Dropdown.Item key={index} onClick={() => handleDeleteMovie(movie.id)}>{movie.Name} - {movie.Hour}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="success ml-2" onClick={handleAddMovie}>
                Add Movie
              </Button>
            </Col>
          </Row>
        )}

        <Row className="justify-content-center">
          {!isAdmin && !userPage && movies.map((movie, index) => (
            <Col key={index} xs={12} md={6} lg={2} className="mb-3 d-flex justify-content-center"
              style={{ marginLeft: '8%', marginRight: '8%' }}>
              <MovieCard movie={movie} role={""} />
            </Col>
          ))}
        </Row>

        <Row className="justify-content-center">
          {userPage && movies.map((movie, index) => (
            <Col key={index} xs={12} md={6} lg={4} className="mb-3 d-flex justify-content-center"
              style={{ marginLeft: '8%', marginRight: '8%' }}>
              <MovieCard movie={movie} role={"user"} />
            </Col>
          ))}
        </Row>

        <Modal show={showAddMovieModal} onHide={handleCloseAddMovieModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Movie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddMovieSubmit}>
              <Form.Group controlId="formMovieName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="Name" value={newMovie.Name} onChange={handleInputChange} required autoFocus />
              </Form.Group>
              <Form.Group controlId="formMovieCategories">
                <Form.Label>Categories</Form.Label>
                <Form.Control type="text" name="Categories" value={newMovie.Categories} onChange={handleInputChange} required />
                <Form.Text className="text-muted">
                  Enter a comma-separated list of categories
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formMovieDuration">
                <Form.Label>Duration</Form.Label>
                <Form.Control type="text" name="Duration" value={newMovie.Duration} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group controlId="formMovieHour">
                <Form.Label>Hour</Form.Label>
                <Form.Control type="text" name="Hour" value={newMovie.Hour} onChange={handleInputChange} required />
              </Form.Group>
              <Form.Group controlId="formMovieImageUrl">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="text" name="Image_url" value={newMovie.Image_url} onChange={handleInputChange} required />
              </Form.Group>
              <Button variant="primary" type="submit" className={"mt-3"}>
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteModal} onHide={handleCancelDeleteMovie}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Movie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this movie?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDeleteMovie}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDeleteMovie}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default App;
