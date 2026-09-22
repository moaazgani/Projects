const API_KEY = "d78ee562";
const BASE_URL = "https://www.omdbapi.com/";
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const fetchMovies = async (query) => {
    const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`
    );
    const data = await response.json();

    if (!response.ok || data.Response !== "True") {
        throw new Error(data.Error || "Unable to load movies");
    }

    return data.Search.map((movie) => ({
        id: movie.imdbID,
        title: movie.Title,
        release_date: movie.Year,
        poster_path: movie.Poster !== "N/A" ? movie.Poster : null,
    }));
};

export const getPopularMovies = async () => {
    const popularQueries = ["Avengers", "Batman", "Spider-Man", "Harry Potter", "Jurassic"];
    const results = await Promise.allSettled(popularQueries.map((query) => fetchMovies(query)));
    const movies = results
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => result.value);

    const uniqueMovies = Array.from(
        new Map(movies.map((movie) => [movie.id, movie])).values()
    );

    if (uniqueMovies.length === 0) {
        throw new Error("Unable to load popular movies");
    }

    return uniqueMovies.slice(0, 20);
};

export const searchMovies = async (query) => {
    return fetchMovies(query);
};

export const searchMovieTrailer = async (movie) => {
    if (!YOUTUBE_API_KEY) {
        throw new Error("YouTube API key is not configured");
    }

    const params = new URLSearchParams({
        key: YOUTUBE_API_KEY,
        part: "snippet",
        q: `${movie.title} ${movie.release_date || ""} official trailer`,
        type: "video",
        maxResults: "1",
        videoEmbeddable: "true",
    });
    const response = await fetch(`${YOUTUBE_BASE_URL}?${params}`);
    const data = await response.json();

    if (!response.ok || !data.items?.length) {
        throw new Error(data.error?.message || "Trailer not found");
    }

    return {
        id: data.items[0].id.videoId,
        title: data.items[0].snippet.title,
    };
};
