/* eslint-disable @typescript-eslint/no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import '../App.css';
import keys from '../../../easyrecskeys.txt';
const CLIENT_ID = "";
const CLIENT_SECRET = "";

function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  //Conect to the API
  useEffect(() => {
    fetch(keys)
      .then(row => row.text())
      .then(
        text => {
          const keyArray = text.split(",")
          console.log("here are the keys before:" + keyArray)
          const CLIENT_ID = keyArray[0]
          const CLIENT_SECRET = keyArray[1]
          console.log("Client ID: " + CLIENT_ID + " and Client Secret:" + CLIENT_SECRET)
          const authParameters = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
          }
          return authParameters;
        })
      .then(authParameters => fetch('https://accounts.spotify.com/api/token', authParameters))
      .then(result => result.json())
      .then(data => {
        console.log(data)
        setAccessToken(data.access_token)
        console.log("Token saved successfully")
      })
  }, [])

  //Search
  const fetchData = (value) => {
    const queryParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', queryParameters)
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        console.log(json.artists.items)
        const artists = json.artists.items
        const results = json.filter((artists) => {
          return value &&
            artist &&
            artist.name &&
            artist.name.toLowerCase().includes(value)
        })
        console.log(results)
      })
  }

  const handleChange = (value) => {
    setSearchInput(value);
    fetchData(value);
  }

  return (
    <>
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
            placeholder='Search for artist'
            type='input'
            value={searchInput}
            onChange={(e) => handleChange(e.target.value)}
          />
        </InputGroup>
      </Container>
      {/*  <Container>
        <Row className='mx-2 row row-cols-5'>
          <Card>
            <Card.Img src='#' />
            <Card.Body>
              <Card.Title>Album Name</Card.Title>
            </Card.Body>
          </Card>
        </Row>
      </Container> */}
    </>
  )
}

export default SearchBar;