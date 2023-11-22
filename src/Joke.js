import React from "react";
import "./Joke.css";

class Joke extends React.Component {
  constructor(props) {
    super(props);
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.lock = this.lock.bind(this);
  }

  upVote() {
    this.props.vote(this.props.id, 1);
  }
  downVote() {
    this.props.vote(this.props.id, -1);
  }

  lock() {
    this.props.lock(this.props.id);
  }

  render() {
    return(
      <div className={`Joke ${this.props.locked ? "Joke-locked" : ""}`}>
        <div className="Joke-votearea">
          <button onClick={this.upVote}>
            <i className="fas fa-thumbs-up" />
          </button>

          <button onClick={this.downVote}>
            <i className="fas fa-thumbs-down" />
          </button>

          <button onClick={this.lock}>
            <i className={`fas ${this.props.locked ? "fa-toggle-on" : "fa-toggle-off"}`}/>
          </button> 

          {this.props.votes}
        </div>

        <div className="Joke-text">{this.props.text}</div>
      </div>
    );
    
  }

}

export default Joke;

