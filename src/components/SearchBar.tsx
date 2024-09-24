/* eslint-disable @typescript-eslint/no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import '../App.css';
import './SearchResultList.css'
import keys from '../../../easyrecskeys.txt';
const CLIENT_ID = "";
const CLIENT_SECRET = "";

function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [results, setResults] = useState([]);
  const [artistID, setArtistID] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [artistGenres, setArtistGenres] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
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
    fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist' + '&limit=5', queryParameters)
      .then((response) => response.json())
      .then(json => {
        setResults(json.artists.items)
      })
      .catch(error => console.log('Unable to fetch data:', error));
  }
  const handleChange = (value) => {
    setSearchInput(value);
    fetchData(value);
  }

  //Fetch artist related info
  const fetchArtistInfo = (value) => {
    const queryParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    fetch('https://api.spotify.com/v1/artists/' + value, queryParameters)
      .then((response) => response.json())
      .then(json => {
        console.log(json.name)
        setArtistGenres([]);
        setArtistGenres(json.genres)
        console.log(artistGenres)
      })
      .catch(error => console.log('Unable to fetch data:', error));

    fetch('https://api.spotify.com/v1/artists/' + value + '/top-tracks', queryParameters)
      .then((response) => response.json())
      .then(json => {
        setPreviewURL("");
        console.log(json)
        setPreviewURL(json.tracks[0].preview_url);
        console.log(previewURL)
      })
      .catch(error => console.log('Unable to fetch data:', error));

    fetch('https://api.spotify.com/v1/artists/' + value + '/related-artists', queryParameters)
      .then((response) => response.json())
      .then(json => {
        setRelatedArtists([]);
        setRelatedArtists(json.artists)
        console.log(relatedArtists)
      })
      .catch(error => console.log('Unable to fetch data:', error));
  }
  return (
    <>
      <Container>
        <InputGroup className=/* {artistID == "" ?  */'mb-3'/*  : 'hidden'} */ size='lg'>
          <FormControl
            placeholder='Search for artist'
            type='input'
            value={searchInput}
            onChange={(e) => handleChange(e.target.value)}
          />
        </InputGroup>
      </Container>
      <Container className=/* {searchInput.length > 0 && artistID == "" ?  */'results-list'/*  : 'hidden'} */>
        <Row>
          {
            results.map((result, id) => {
              return <a key={id} className='list-item' onClick={() => {
                setArtistID("");
                setArtistID(result.id)
                console.log(artistID)
                fetchArtistInfo(artistID)
              }}>
                <Image className='img-thumb' src={result.images[0].url} thumbnail />
                <h5 className='item-name'>{result.name}</h5>
              </a>

            })
          }
        </Row>
      </Container>
    </>
  )
}

export default SearchBar;