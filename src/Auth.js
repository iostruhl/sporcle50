import React, { Component } from 'react'
import './Auth.css'
import * as firebase from 'firebase'

class Auth extends Component {
  constructor() {
    super()
    this.state = {
      email: "",
      password: "",
      confirm: "",
      createNewAccount: false
    }

    this.flipAuthMode = this.flipAuthMode.bind(this)
    this.updateEmail = this.updateEmail.bind(this)
    this.updatePassword = this.updatePassword.bind(this)
    this.updateConfirm = this.updateConfirm.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.logIn = this.logIn.bind(this)
  }

  flipAuthMode() {
    this.setState(prevState => ({
      email: "",
      password: "",
      confirm: "",
      createNewAccount: !prevState.createNewAccount
    }))
  }

  updateEmail(event) {
    this.setState({email: event.target.value})
  }

  updatePassword(event) {
    this.setState({password: event.target.value})
  }

  updateConfirm(event) {
    this.setState({confirm: event.target.value})
  }

  createAccount() {
    if (this.state.password === this.state.confirm) {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
        alert(error)
      })
    }
    else {
      alert("Passwords do not match.")
    }
  }

  logIn() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
      alert(error)
    })
  }

  render() {
    if (this.state.createNewAccount) {
      return (
        <div className="Auth">
          <h1 className="Auth-title">Sporcle50: Learn Your Section!</h1>
          <button onClick={this.flipAuthMode}>Log In to Existing Account</button><br /><br />
          <h3>Create New Account</h3>
          <input type="text" autoFocus placeholder="Harvard Email Address" value={this.state.email} onChange={this.updateEmail} /><br />
          <input type="password" placeholder="Password" value={this.state.password} onChange={this.updatePassword} /><br />
          <input type="password" placeholder="Confirm Password" value={this.state.confirm} onChange={this.updateConfirm} /><br /><br />
          <button onClick={this.createAccount}>Create Account</button>
        </div>
      )
    }
    else {
      return (
        <div className="Auth">
          <h1 className="Auth-title">Sporcle50: Learn Your Section!</h1>
          <button onClick={this.flipAuthMode}>Create New Account</button><br /><br />
          <h3>Log In</h3>
          <input type="text" autoFocus placeholder="Harvard Email Address" value={this.state.email} onChange={this.updateEmail} /><br />
          <input type="password" placeholder="Password" value={this.state.password} onChange={this.updatePassword} /><br />
          <button onClick={this.logIn}>Log In</button>
          
        </div>
      )
    }
  }
}

export default Auth
