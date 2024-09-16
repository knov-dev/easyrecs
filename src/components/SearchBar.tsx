/* eslint-disable @typescript-eslint/no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import '../App.css';
import keys from '../../../easyrecskeys.txt';
const CLIENT_ID = "";
const CLIENT_SECRET = "";

function SearchBar() {
  const url = "http://ws.audioscrobbler.com/2.0/";
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");


  //Conect to the APIs
  useEffect(() => {
    fetch(keys)
      .then(row => row.text())
      .then(
        text => {
          const keyArray = text.split(",")
          const CLIENT_ID = keyArray[0]
          const CLIENT_SECRET = keyArray[1]
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
      .then(data => setAccessToken(data.accessToken))
      .then(() => console.log("Token saved successfully"))
  }, [])

  //Search
  async function Search(){
    console.log("Search for " + searchInput);
  }

  return (

    <>
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
            placeholder='Search for artist'
            type='input'
            onKeyUp={event => {
              if (event.key == "Enter") {
                Search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={Search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className='mx-2 row row-cols-5'>
          <Card>
            <Card.Img src='#' />
            <Card.Body>
              <Card.Title>Album Name</Card.Title>
            </Card.Body>
          </Card>
        </Row>

      </Container>
    </>
  )
}

export default SearchBar;