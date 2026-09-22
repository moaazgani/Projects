import '../css/Favorites.css'
import '../css/Trailer.css'
import { usemovieContext } from '../contexts/movieContext'
import MovieCard from '../components/movieCard'
import { searchMovieTrailer } from '../services/api'
import { useState } from 'react'

function Favorites() {

    const { favorites } = usemovieContext();
    const [trailer, setTrailer] = useState(null);
    const [trailerLoading, setTrailerLoading] = useState(false);
    const [trailerError, setTrailerError] = useState(null);

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

    if (favorites.length > 0) {

        return (
            <div className='favorites'>
                <h2>Your Favorites</h2>
                <div className="movie-grid">
                    {favorites.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} onMovieClick={handleMovieClick} />
                    ))}
                </div>
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
        );
    }
    return (
        <div className="favorite-empty">
            <h2>No favorite movies yet</h2>
            <p>Start adding movies to your favorite and they will apprear here..</p>
        </div>
    );
}

export default Favorites