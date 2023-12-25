import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import './MovieCard.css';

function MovieCard(props) {
    const { Name, Categories, Duration, Hour, Image_url } = props.movie;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [reservedSeats, setReservedSeats] = useState([]);
    const pricePerTicket = 20;

    useEffect(() => {
        const token = localStorage.getItem("user");
        if (token) setIsLoggedIn(true);
    }, []);

    const fetchReservedSeats = async () => {
        try {
            const response = await fetch('http://localhost:5000/get_reserved_seats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Mode': 'no-cors'
                },
                body: JSON.stringify({
                    movie_id: props.movie.id
                })
            });

            const data = await response.json();

            if (response.ok) {
                setReservedSeats(data.reservedSeats);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error retrieving reserved seats:', error);
        }
    };

    const handleReserveClick = () => {
        fetchReservedSeats();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSeatSelect = (seatIndex) => {
        if (reservedSeats.includes(seatIndex)) return;

        if (selectedSeats.includes(seatIndex)) {
            setSelectedSeats(selectedSeats => selectedSeats.filter(seat => seat !== seatIndex));
        } else {
            if (selectedSeats.length < 5) {
                setSelectedSeats(selectedSeats => [...selectedSeats, seatIndex]);
            }
        }
    };

    const renderSeats = () => {
        const rows = Array.from({ length: 8 }, (_, i) => i + 1);
        const seats = Array.from({ length: 9 }, (_, i) => i + 1);

        return (
            <div className="seats-container">
                {rows.map(row => (
                    <div key={row} className="seat-row">
                        <div className="row-number">{row}</div>
                        {seats.map(seat => (
                            <div
                                key={seat}
                                className={`seat ${selectedSeats.includes(`${row}${seat}`) ? 'selected' : ''} ${reservedSeats.includes(`${row}${seat}`) ? 'reserved' : ''}`}
                                onClick={() => handleSeatSelect(`${row}${seat}`)}
                            >
                                {seat}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const renderTicketList = () => {
        return selectedSeats.map((seatIndex, index) => {
            const row = Math.floor(seatIndex / 10);
            const seat = seatIndex % 10;
            return (
                <div key={index} className="ticket-info">
                    <div>
                        <span>Ticket {index + 1}:</span>
                        <span> Row {row} </span>
                        <span>Seat {seat} |</span>
                    </div>
                    <div>
                        <span>Price: {pricePerTicket} lei</span>
                    </div>
                </div>
            );
        });
    };

    const reserveSeats = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

            const response = await fetch('http://localhost:5000/reserve_seats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Mode': 'no-cors'
                },
                body: JSON.stringify({
                    movie_id: props.movie.id,
                    selected_seats: selectedSeats,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Reservation successful!',
                    text: `You have reserved ${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''}.`,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    text: data.error,
                });
            }
        } catch (error) {
            console.error('Error during seat reservation:', error);
        }
    };

    const handleReserveConfirm = () => {
        reserveSeats();
        handleCloseModal();
        setSelectedSeats([]);
    };

    return (
        <Card style={{ width: '20rem', margin: '5%', flexShrink: 0 }}>
            <Card.Img variant="top" src={require(`${Image_url}`) || 'placeholder-image-url'} style={{ height: "60vh" }} />
            <Card.Body>
                <Card.Title>{Name || 'Movie Title'}</Card.Title>
                <Card.Text>
                    {Categories && Categories.length > 0
                        ? `Categories: ${Categories.join(', ')}`
                        : 'No categories available'}
                </Card.Text>
                <Card.Text>
                    Duration: {Duration || 'N/A'} | Hour: {Hour || 'N/A'}
                </Card.Text>
            </Card.Body>
            <Card.Body>
                {isLoggedIn && <Button variant="primary" onClick={handleReserveClick}>Reserve Now</Button>}
            </Card.Body>

            <Modal show={showModal} onHide={handleCloseModal} className="moviecard-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Reserve Tickets</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderSeats()}
                    {selectedSeats.length > 0 && (
                        <>
                            <h4>Ticket Information:</h4>
                            {renderTicketList()}
                            {selectedSeats.length === 5 && (
                                <p className="max-selection-warning">You have selected the maximum number of tickets.</p>
                            )}
                            <div className="total-price">
                                Total Price: {selectedSeats.length * pricePerTicket} lei
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleReserveConfirm}>
                        Reserve
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

export default MovieCard;
