import '../App.css'
const url = "http://ws.audioscrobbler.com/2.0/";
const [data, setData] = useState([]);

function SearchBar(){
    return (
        <>
        <input className="searchBar" type="text" placeholder='Search for an artist, genre...' />
        </>
      )
}

export default SearchBar;