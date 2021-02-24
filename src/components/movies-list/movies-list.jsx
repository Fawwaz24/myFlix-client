import React from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import { MovieCard } from '../movie-card/movie-card';

const mapStateToProps = state => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let fliteredMovies = movies;

  if (visibilityFilter !== '') {
    fliteredMovies = movies.filter(m => m.Title.toLocaleLowerCase().includes(visibilityFilter.toLocaleLowerCase()));
  }

  if (!movies) return <div className="main-view" />;

  return <div className="movies-list">
    <VisibilityFilterInput visibilityFilter={visibilityFilter} />
    <Container>
      <Row>
        {/* <Col> */}
        {fliteredMovies.map(m => <MovieCard key={m._id} movie={m}/>)}
        {/* </Col> */}
      </Row>
    </Container>
    
    
  </div>;
}
export default connect(mapStateToProps)(MoviesList);
