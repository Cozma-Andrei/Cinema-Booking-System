import './App.css';
import MovieCard from './components/MovieCard';
import Navbar from "./components/Navbar";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function App() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [movies, setMovies] = useState([]);
  const [userPage, setUserPage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
  }, [selectedDay, isAdmin, userPage]);

  useEffect(() => {
    if (window.location.hash !== "#reservations") {
      setIsAdmin(false);
      setUserPage(false);
    }
    if (!isAdmin) setUserPage(true);
    else setUserPage(false);
  }, [isAdmin])

  useEffect(() => {
    if (window.location.hash !== "#reservations") {
      setIsAdmin(false);
      setUserPage(false);
    }
  }, [userPage])

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handlePageReservations = () => {
    setIsAdmin(localStorage.getItem('admin'));
  }

  const fetchMoviesByDay = async (day) => {
    try {
      if (!userPage) {
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

      else {
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
    } catch (error) {
      console.error('Error fetching movies', error);
    }
  };

  return (
    <div className="App">
      <Navbar goPageReservations={handlePageReservations} />
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

        <Row className="justify-content-center">
          {!isAdmin && !userPage && movies.map((movie, index) => (
            <Col key={index} xs={12} md={6} lg={4} className="mb-3 d-flex justify-content-center">
              <MovieCard movie={movie} role={""} />
            </Col>
          ))}
        </Row>

        <Row className="justify-content-center">
          {(isAdmin || userPage) && movies.map((movie, index) => (
            <Col key={index} xs={12} md={6} lg={4} className="mb-3 d-flex justify-content-center">
              <MovieCard movie={movie} role={"user"} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;
