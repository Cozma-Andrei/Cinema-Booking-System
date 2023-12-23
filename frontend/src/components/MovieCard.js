import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function MovieCard(props) {
    const { Name, Categories, Duration, Hour, Image_url } = props.movie;

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
                <Button variant="primary">Reserve Now</Button>
            </Card.Body>
        </Card>
    );
}

export default MovieCard;
