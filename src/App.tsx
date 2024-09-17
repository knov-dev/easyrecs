import  SearchBar from './components/SearchBar';
import SearchResultList from './components/SearchResultList';
import {useState} from 'react';

import './App.css'

function App() {
  const[results, setResults] = useState([]);
  return (
    <>
    <SearchBar setResults={setResults}/>
    <SearchResultList results={results}/>
    </>
  )

}

export default App
