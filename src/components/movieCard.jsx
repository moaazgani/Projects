import '../css/movieCard.css'
import { usemovieContext } from '../contexts/movieContext';
import { useState } from 'react';

function MovieCard({ movie, onMovieClick }) {
    const {addToFavorites, removeFromFav, isfavorites} = usemovieContext()
    const favorites = isfavorites(movie.id)
    const [showStreamingLinks, setShowStreamingLinks] = useState(false)
    const encodedTitle = encodeURIComponent(movie.title)

    function like(e) {
        e.preventDefault()
        e.stopPropagation()
        if(favorites) removeFromFav(movie.id)
            else addToFavorites(movie)
    }

    return <div className="movie-card" onClick={() => onMovieClick?.(movie)}>
        <div className="movie-poster">
            <img src={movie.poster_path} alt={movie.title} />
            <div className="movie-overlay">
                <button className={`favorite-btn ${favorites ? "active" : ""}`} onClick={like} aria-label="Like movie">
                    ♥
                </button>
                <button className="download-btn" type="button" onClick={(e) => { e.stopPropagation(); setShowStreamingLinks((current) => !current) }} aria-label="Find where to watch" title="Find where to watch">
                    ↓
                </button>
                {showStreamingLinks && (
                    <div className="streaming-links" onClick={(e) => e.stopPropagation()}>
                        <span>Watch legally</span>
                        <a href={`https://www.netflix.com/search?q=${encodedTitle}`} target="_blank" rel="noopener noreferrer">Netflix</a>
                        <a href={`https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedTitle}`} target="_blank" rel="noopener noreferrer">Prime Video</a>
                        <a href={`https://www.hotstar.com/in/search?q=${encodedTitle}`} target="_blank" rel="noopener noreferrer">Disney+ Hotstar</a>
                    </div>
                )}
            </div>
        </div>
        <div className="movie-info">
            <h3 className="">{movie.title}</h3>
            <p>{movie.release_date?.split("-")[0]}</p>
        </div>
    </div>
}

export default MovieCard;