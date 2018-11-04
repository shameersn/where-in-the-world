import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import GoogleMapReact from 'google-map-react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import * as React from 'react';
import {Component, Fragment} from 'react';
import {graphql} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import styled from "styled-components";

const INSERT_ANSWER = gql`
    mutation InsertAnswer($gameId: uuid!, $playerId: uuid!, $latLocation: Float!, $longLocation: Float!) {
        insert_Answer(objects: [{
            gameId: $gameId,
            latLocation: $latLocation,
            longLocation: $longLocation,
            playerID: $playerId,
        }]) {
            affected_rows
        }
    }
`;

const SubmitButton = styled.button`
    font-size: 1.3em;
    position: absolute;
    bottom: 60px;
    width: 100%;
    margin: 0 auto;
    border-radius: 20px;
    background-color: #db6a3e;
    border: none;
    padding: .5em 0em;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: .2em;
    color: #fff;
    cursor: pointer;
`

const Marker = () => <FontAwesomeIcon icon="map-marker"/>;

class AnswerSelection extends Component {
  static defaultProps = {
    center: {
      lat: 45,
      lng: 260
    },
    zoom: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleSubmit() {
    this.props
      .mutate({
        variables: {
          gameId: this.props.gameId,
          playerId: localStorage.getItem('witw-playerId'),
          latLocation: parseFloat(this.state.latitude),
          longLocation: parseFloat(this.state.longitude),
        }
      })
      .then(() => {
        // move player to results screen
        this.props.history.push(`/results?gameid=${this.props.gameId}`);
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  handleClick({x, y, lat, lng}) {
    console.log(`${lat}, ${lng}`);
    this.setState({
      latitude: lat,
      longitude: lng
    });
  }

  render() {
    return (
      <Fragment>
        <div style={{ height: "calc(100vh - 370px)", width: "100%"}}>
          <GoogleMapReact bootstrapURLKeys={{key: "AIzaSyA8cmyFachXAjlw_lc7QvC8JX1MnmGPJWw"}}
                          defaultCenter={this.props.center} defaultZoom={this.props.zoom}
                          onClick={this.handleClick}>
            <Marker lat={this.state.latitude} lng={this.state.longitude}/>
          </GoogleMapReact>
        </div>
        <SubmitButton onClick={this.handleSubmit}>Submit</SubmitButton>
      </Fragment>
    )
  }
}

AnswerSelection.propTypes = {
  questionId: PropTypes.string.isRequired,
  gameId: PropTypes.string.isRequired,
};

export default withRouter(graphql(INSERT_ANSWER)(AnswerSelection));
