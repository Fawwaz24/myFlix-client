import React from 'react';
import axios from 'axios';
import {MovieCard} from '../movie-card/movie-card';
import {MovieView} from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
export class MainView extends React.Component {
  constructor() {
    super();
// Initial state is set to null
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null
    };
  }
    // One of the "hooks" available in a React Component
    componentDidMount() {
      axios.get('https://myflixdb-fs.herokuapp.com/movies')
        .then(response => {
          // Assign the result to the state
          this.setState({
            movies: response.data
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  
    onMovieClick(movie) {
      this.setState({
        selectedMovie: movie
      });
    }
    /* When a user successfully logs in, this function updates the `user` property in state to that *particular user*/

  onLoggedIn(user) {
    this.setState({
      user
    });
  }
    render() {
      const { movies, selectedMovie, user } = this.state;
      /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are *passed as a prop to the LoginView*/

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

  
      // Before the movies have been loaded
      if (!movies) return <div className="main-view"/>;
  
      return (
        <div className="main-view">
          {selectedMovie
            ? (
                <Row className="justify-content-md-center">
                  <Col md={8} style={{border: '1px solid black'}}>
                    <MovieView movie={selectedMovie} onBackClick={movie => this.onMovieClick(null)} />
                  </Col>
                </Row>
              )
            : (
              <Row className="justify-content-md-center">
                {movies.map(movie => (
                  <Col md={3}>
                    <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)}/>
                  </Col>
                ))}
              </Row>
            )
          }
        </div>
      );
    }
  }