import MovieCard from "../components/movieCard"
import { useState, useEffect } from "react"
import { searchMovies, getPopularMovies, searchMovieTrailer } from "../services/api";
import '../css/Home.css'
import '../css/Trailer.css'

function Home() {
    const [searchQuary, setSearchQuary] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)
    const [trailer, setTrailer] = useState(null);
    const [trailerLoading, setTrailerLoading] = useState(false);
    const [trailerError, setTrailerError] = useState(null);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch (err) {
                console.log(err)
                setError("Failed to load movies...")
            }
            finally {
                setLoading(false)
            }
        }

        loadPopularMovies()
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault();
        if(!searchQuary.trim()) return
        if(loading) return

        setLoading(true)
        try{
            const searchResults = await searchMovies(searchQuary)
            setMovies(searchResults)
            setError(null)
        }
        catch(err){
            console.log(err)
            setError("Failed")
        }
        finally{
            setLoading(false)
        }
        setSearchQuary("Avengers")
    };

    const handleMovieClick = async (movie) => {
        setTrailer(null);
        setTrailerError(null);
        setTrailerLoading(true);

        try {
            const result = await searchMovieTrailer(movie);
            setTrailer({ ...result, movieTitle: movie.title });
        } catch (err) {
            setTrailerError(err.message);
        } finally {
            setTrailerLoading(false);
        }
    };

    const closeTrailer = () => {
        setTrailer(null);
        setTrailerError(null);
    };

    return <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                placeholder="Search for movies..."
                className="search-input"
                value={searchQuary}
                onChange={(e) => setSearchQuary(e.target.value)} />
            <button type="submit" className="search-button">Search</button>
        </form>


        {error && <div className="error-message">{error}</div>}
        {loading ? (
            <div className="loading">Loading...</div>
                ) : (
                <>
                    <div className="movie-grid">
                        {movies.map((movie) => (
                            <MovieCard movie={movie} key={movie.id} onMovieClick={handleMovieClick} />
                        ))}
                    </div>
                </>
        )}
        {(trailerLoading || trailerError || trailer) && (
            <div className="trailer-modal" role="dialog" aria-modal="true" aria-label="Movie trailer">
                <div className="trailer-dialog">
                    <button className="trailer-close" onClick={closeTrailer} aria-label="Close trailer">×</button>
                    {trailerLoading && <p className="trailer-status">Finding the trailer...</p>}
                    {trailerError && <p className="trailer-status">{trailerError}</p>}
                    {trailer && (
                        <>
                            <h2>{trailer.movieTitle} trailer</h2>
                            <div className="trailer-frame">
                                <iframe
                                    src={`https://www.youtube.com/embed/${trailer.id}`}
                                    title={trailer.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        )}
            </div>
};

export default Home