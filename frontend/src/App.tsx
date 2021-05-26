import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const baseUri: string = process.env.REACT_APP_API_URL!;

  const [allPhotos, setAllPhotos] = useState([]);

  async function getPhotos() {
    const { data } = await axios.get(`${baseUri}/photos`);
    setAllPhotos(data)
  }

  useEffect(() => {
    getPhotos()
  }, [])

  function getCarouselImage(photo: { filename: string; url: string }) {
    return <Carousel.Item interval={1000}>
      <img src={photo.url} alt={photo.filename} className="h-100" />
      <Carousel.Caption>
        <h3>{photo.filename}</h3>
      </Carousel.Caption>
    </Carousel.Item>
  }

  return (
    <div className="App bg-secondary min-vh-100">
      <h1>Super Mario and Friends</h1>
      <Carousel fade>
        {allPhotos.map((photo) => {
          return getCarouselImage(photo)
        })}
      </Carousel>
    </div>
  );
}

export default App;
