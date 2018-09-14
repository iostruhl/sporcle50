import React, { Component } from 'react'
import './Game.css'
import * as firebase from 'firebase'

class Game extends Component {
  constructor() {
    super()
    this.state = {
      imgs: null,
      imgsRemaining: null,
      current: null,
      currentFirstName: null,
      remaining: null,
      start: false,
      time: 0.0,
      answer: "",
      displayAnswer: false,
      loading: true
    }

    this.handleChange = this.handleChange.bind(this);
    this.getRandomImage = this.getRandomImage.bind(this);
    this.startGame = this.startGame.bind(this);
    this.continueGame = this.continueGame.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    //const context = require.context("../photos/", false, /.*\.jpg$/)
    this.imgs = {} // {First-Last: URL}
    firebase.firestore().doc(`users/${this.props.uid}`).collection('names').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let name = doc.id.substring(0, doc.id.length - 4)
        this.imgs[name] = doc.data().url
      })
    })
    /*
    context.keys().forEach(key => {
      let name = key.split('./').pop().substring(0, key.length - 6)
      this.imgs[name] = context(key)
    })
    */
    this.setState({
      loading: false
    })
    
  }

  startGame() {
    let names = Object.keys(this.imgs)
    let next = this.getRandomImage(names)
    this.timer = setInterval(this.tick, 100)
    this.paused = false

    this.setState({
      imgsRemaining: names,
      current: next,
      currentFirstName: next.split('-')[0].toLowerCase(),
      remaining: names.length,
      time: 0.0,
      answer: "",
      start: true
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  tick() {
    if (!this.paused) {
      this.setState(prevState => ({
        time: prevState.time + 0.1
      }))
    }
  }

  getRandomImage(imgs) {
    return imgs[Math.floor(Math.random() * imgs.length)]
  }

  handleChange(event) {
    this.setState({answer: event.target.value}, () => {
      // Correct answer entered
      if (this.state.answer.toLowerCase() === this.state.currentFirstName) {
        this.paused = true
        // Hack. Remove the answered element from imgsRemaining
        this.state.imgsRemaining.splice(this.state.imgsRemaining.indexOf(this.state.current), 1)
        let updatedImgs = this.state.imgsRemaining

        // Game ended
        if (!updatedImgs.length) {
            this.setState({start: false})
            clearInterval(this.timer)
            return
        }

        // Set up next image
        let next = this.getRandomImage(updatedImgs)
        this.setState(prevState => ({
          imgsRemaining: updatedImgs,
          current: next,
          currentFirstName: next.split('-')[0].toLowerCase(),
          remaining: prevState.remaining - 1,
          answer: ""
        }))
        this.paused = false
      }

      // If player gives up
      if (this.state.answer === "?") {
        this.paused = true
        this.setState({
          displayAnswer: true
        })
      }
    });
  }

  continueGame() {
    let next = this.getRandomImage(this.state.imgsRemaining)
    this.setState({
      current: next,
      currentFirstName: next.split('-')[0].toLowerCase(),
      answer: "",
      displayAnswer: false
    })
    this.paused = false
  }

  render() {
    if (this.state.loading) {
      return null
    }
    else {
      return (
        <div className="Game">
          <h1 className="Game-title">Sporcle50: Learn Your Section!</h1>
          <button onClick={this.props.logOut}>Log Out</button>
          <button onClick={this.props.uploadNew}>Upload New Photos</button>
          {!this.state.start && // Before the game starts
            <div>
              <h1 className="Game-stats">{this.state.time.toFixed(1)}</h1>
              <button autoFocus onClick={this.startGame}>Start</button>
            </div>
          }
          {this.state.start && !this.state.displayAnswer && // Normal gameplay
            <div>
              <h1 className="Game-stats">{this.state.time.toFixed(1)}</h1>
              <h1 className="Game-stats">Remaining: {this.state.remaining}</h1>
              <img src={this.imgs[this.state.current]} alt="student" width="300" height="300" placeholder={require('./cs50.jpg')}/>
              <div>
                <input type="text" autoFocus placeholder="Name" value={this.state.answer} onChange={this.handleChange} />
              </div>
            </div>
          }
          {this.state.start && this.state.displayAnswer && // Display answer
            <div>
              <h1 className="Game-stats">{this.state.current.split('-').join(' ')}</h1>
              <img src={this.imgs[this.state.current]} alt="student" width="300" height="300" placeholder={require('./cs50.jpg')}/>
              <div>
                <button autoFocus onClick={this.continueGame}>Continue</button>
              </div>
            </div>
          }
        </div>
      );  
    }
    
  }
}

export default Game
