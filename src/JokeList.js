import React from "react";
import axios from "axios";
import Joke from "./Joke";
import loadinggif from './loading.gif';
import "./JokeList.css";

class JokeList extends React.Component {
  static defaultProps = {
    numJokesToGet: 10
  };
  constructor(props) {
    super(props);
    this.state = { jokes: [] };
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote = this.vote.bind(this);
    this.lock = this.lock.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }


  async getJokes() {
    try {

      let jokes = this.state.jokes;
      let jokeVotes = {};
      let seenJokes = new Set(jokes.map(j => j.id));

      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...joke } = res.data;
        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokeVotes[joke.id] = jokeVotes[joke.id] || 0;
          jokes.push({ ...joke, votes: jokeVotes[joke.id], locked: false });
        } else {
          console.log('A dupe was found...');
        }
      }
      
      this.setState({ jokes });
    } catch (e) {
      console.log(e);
      
    }
  }

  generateNewJokes() {
    this.setState(s => ({ jokes: s.jokes.filter(j => j.locked)}));
  }

  lock(id) {
    this.setState(s => ({
      jokes: s.jokes.map(j => (j.id === id ? {...j, locked: !j.locked } : j))
    }));
  }
    
  vote(id, delta) {
    this.setState(prevState => ({ 
      jokes: prevState.jokes.map((j) => 
        j.id === id ? { ...j, votes: j.votes + delta } : j
        ),
    }));
  }

  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    let allLock = sortedJokes.filter(j => j.locked).length === this.props.numJokesToGet;

    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes} disabled={allLock}>
          Get New Jokes
        </button>

        {sortedJokes.map(j => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={this.vote}
            locked={j.locked}
            lock={this.lock}
          />
        ))}

        {sortedJokes.length < this.props.numJokesToGet ? (
          <div className="loading">
            <img src={loadinggif} alt="Loading" />
          </div>
        ) : null}

      </div>
    );
  }
}

export default JokeList;
