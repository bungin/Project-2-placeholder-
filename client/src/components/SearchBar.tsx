import { useState } from 'react';
import '../index.css';
import Auth from '../utils/auth';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    const handleSearch = async () => {
        if (!searchTerm) {
            alert("Please enter a song name.");
            return;
        }
        try {
            const response = await fetch('/api/music/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'SoundScaped',
                    'Authorization': `Bearer ${Auth.getToken()}`,
                },
                body: JSON.stringify({ songName: searchTerm }),
              });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResults(data.results?.trackmatches?.track || []);
            setError('');
        } catch (error) {
            console.error('Error:', error);
            setError('Error fetching results');
        }
    };
    // Add a handler for the keypress event
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    return (
        <div style={{ backgroundImage: 'linear-gradient(to right,#000000e0, #150f8006)', padding: '20px' }}>
            <input
                className='searchBar'
                type="text"
                placeholder="Search for"
                value={searchTerm}
                onChange={handleChange}
                onKeyUp={handleKeyPress} // Add the keypress event handler here
            />
            <button onClick={handleSearch}>Search</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                {results.length > 0 ? (
                    results.map((track, index) => (
                        <div key={index}>
                            {track.name} by {track.artist}
                        </div>
                    ))
                ) : (
                    <div>No results found.</div>
                )}
            </div>
        </div>
    );
}
export default SearchBar;