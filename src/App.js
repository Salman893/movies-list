import React, { useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, [])

  const addMovieHandler = async (movie) => {
    const response = await fetch(
      "https://practice-sec14-http-movies-default-rtdb.firebaseio.com/movie.json",
      {
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );

    const data = await response.json();
    console.log(data);
    fetchMovies();
  };

  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://practice-sec14-http-movies-default-rtdb.firebaseio.com/movie.json"
      );
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const response = await res.json();

      const loadedMovies = [];

      for (let key in response) {
        loadedMovies.push({
          id: key,
          title: response[key].title,
          openingText: response[key].openingText,
          releaseDate: response[key].releaseDate,
        });
      }
      setMovies(loadedMovies);      
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  let content = <p>No Movies Found</p>;

  if(movies.length > 0){
    content = <MoviesList movies={movies}/>
  }
  if(error) {
    content = <p>{error}</p>
  }
  if(isLoading) {
    content= <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
