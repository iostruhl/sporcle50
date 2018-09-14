import React, { Component } from 'react'
import './App.css'
import Game from './Game'
import Auth from './Auth'
import Upload from './Upload'
import * as firebase from 'firebase'

const config = {
  apiKey: "AIzaSyBzEhC-t2TO7R-xuxJsA-6QZaOaFmg-mEM",
  authDomain: "sporcle50-e268b.firebaseapp.com",
  databaseURL: "https://sporcle50-e268b.firebaseio.com",
  projectId: "sporcle50-e268b",
  storageBucket: "sporcle50-e268b.appspot.com",
  messagingSenderId: "710467259615"
}
firebase.initializeApp(config);

var db = firebase.firestore()
db.settings({
  timestampsInSnapshots: true
})

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      populated: false,
      loading: true
    }

    this.signOut = this.signOut.bind(this)
    this.uploadNew = this.uploadNew.bind(this)
    this.verifyUpload = this.verifyUpload.bind(this)
  }

  componentDidMount() {
    // Listen for authentication state changes
    // Fires once at the beginning even if the user isn't logged in
    firebase.auth().onAuthStateChanged(user => {
      let promises = []
      let populated = false
      if (user) {
        promises.push(db.doc(`users/${user.uid}`).get().then(doc => {
          if (doc.exists) {
            populated = doc.data().populated
          }
          else {
            // returns this promise so that the first call to db.doc is .then()able
            return db.doc(`users/${user.uid}`).set({populated: false})
          }
        }))
      }
      Promise.all(promises).then(() => {
        this.setState({
          user: user,
          populated: populated,
          loading: false
        })
      })
    })  
  }
  uploadNew() {
    this.setState({populated: false})
  }

  verifyUpload() {
    db.doc(`users/${this.state.user.uid}`).get().then(doc => {
      this.setState({populated: doc.data().populated})
    })
  }

  signOut() {
    firebase.auth().signOut().catch(error => {
      alert(error)
    })
  }

  render() {
    if (this.state.loading) {
      return null
    }
    else if(this.state.user) {
      // User has authenticated and has populated database with photos
      if (this.state.populated) {
        return <Game logOut={this.signOut} uid={this.state.user.uid} uploadNew={this.uploadNew}/>
      }
      // User has authenticated, but has not uploaded photos
      else {
        return <Upload logOut={this.signOut} uid={this.state.user.uid} verifyUpload={this.verifyUpload}/>
      }
    }
    // User not authenticated
    else {
      return <Auth />
    }
  }
}

export default App
