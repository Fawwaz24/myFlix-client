import React from "react";
import axios from "axios";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { BrowserRouter as Router, Route} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { RegistrationView } from "../registration-view/registration-view";
import { ProfileView } from '../profile-view/profile-view';
import { UpdateProfile } from '../update-profile/update-profile';
import { setMovies } from '../../actions/actions';
import { connect } from 'react-redux';
import MoviesList from '../movies-list/movies-list'
import {DirectorView} from '../director-view/director-view'
import {GenreView} from '../genre-view/genre-view'

class MainView extends React.Component {
  constructor() {
    super();
    // Initial state is set to null
    this.state = {
      movies: [],
      selectedMovie: '',
      user: '',
    };
  }
  // One of the "hooks" available in a React Component
  getMovies(token) {
    axios.get('https://myflixdb-fs.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      // Assign the result to the state
      this.props.setMovies(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
    }
  }
  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie,
    });
  }
  /* When a user successfully logs in, this function updates the `user` property in state to that *particular user*/

  
onLoggedIn(authData) {
  console.log(authData);
  this.setState({
    user: authData.user.Username
  });

  localStorage.setItem('token', authData.token);
  localStorage.setItem('user', authData.user.Username);
  this.getMovies(authData.token);
}

logOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.setState({
    user: null,
  });
  console.log('logout successful');
  alert('You have been successfully logged out');
  window.open('/', '_self');
}
  render() {
    let { movies } = this.props;
    let { user } = this.state;
    /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are *passed as a prop to the LoginView*/


    return (
      <Router>
        <div className="main-view">
        <Navbar sticky="top" expand="lg" className="mb-2 navbar-styles">
            <Navbar.Brand className="navbar-brand">
              <Link to={`/`}>myFlix</Link>
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="bg-light"
            />
            <Navbar.Collapse
              className="justify-content-end navbar-light"
              id="basic-navbar-nav"
            >
              {!user ? (
                <ul>
                  <Link to={`/`}>
                    <Button variant="link">Login</Button>
                  </Link>
                  <Link to={`/register`}>
                    <Button variant="link">Register</Button>
                  </Link>
                </ul>
              ) : (
                <ul>
                  <Link to={`/`}>
                    <Button variant="link" onClick={() => this.logOut()}>
                      Log out
                    </Button>
                  </Link>
                  <Link to={`/users/${user}`}>
                    <Button variant="link">Account</Button>
                  </Link>
                  <Link to={`/`}>
                    <Button variant="link">Movies</Button>
                  </Link>
                </ul>
              )}
            </Navbar.Collapse>
          </Navbar>
          
          <Route
            path="/movies/:movieId"
            render={({ match }) => (
              <MovieView
                movie={movies.find((m) => m._id === match.params.movieId)}
              />
            )}
          />
          <Route
            path="/directors/:name"
            render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return (
                <DirectorView
                  director={
                    movies.find((m) => m.Director.Name === match.params.name)
                  }
                  movies = {movies}
                />
              );
            }}
          />
           <Route
            path="/genres/:name"
            render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return (
                <GenreView
                  genre={
                    movies.find((m) => m.Genre.Name === match.params.name)
                  }
                  movies = {movies}
                />
              );
            }}
          />
         <Route 
          exact path="/" 
          render={() => {
            if (!user) 
              return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
              return <MoviesList movies={movies}/>;
          }} />

          <Route path="/register" render={() => <RegistrationView />} />
          <Route
            exact
            path="/users/:userId"
            render={() => <ProfileView movies={movies} />}
          />
          <Route
            path="/update/:userId"
            render={() => {
              return <UpdateProfile />;
            }}
          />
        </div>
      </Router>
    );
  }
}
let mapStateToProps = state => {
  return { movies: state.movies }
}

export default connect(mapStateToProps, { setMovies } )(MainView);
