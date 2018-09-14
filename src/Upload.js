import React, { Component } from 'react'
import './Upload.css'
import * as firebase from 'firebase'

class Upload extends Component {
  constructor() {
    super()
    this.state = {
      uploading: false,
      pictures: null
    }

    this.handleFileSelect = this.handleFileSelect.bind(this)
    this.upload = this.upload.bind(this)
  }

  handleFileSelect(event) {
    this.setState({pictures: event.target.files})
  }

  upload() {
    this.setState({uploading: true})

    // Upload one image
    // Returns a promise that is fulfilled when the image is uploaded
    let singleUpload = img => {
      return (firebase.storage().ref(`${this.props.uid}/${img.name}`).put(img)
        .then(task => {
          return task.ref.getDownloadURL()
        })
        .then(url => {
          console.log(url)
          return firebase.firestore().doc(`users/${this.props.uid}/names/${img.name}`).set({url: url})
        })
      )
    }

    if (!this.state.pictures) {
      alert("Must select at least one file to upload.")
      this.setState({uploading: false})
      return
    }

    let promises = []
    for (let i = 0; i < this.state.pictures.length; i++) {
      promises.push(singleUpload(this.state.pictures[i]))
    }
    Promise.all(promises)
    .then(() => {
      firebase.firestore().doc(`users/${this.props.uid}`).set({populated: true})
    })
    .then(() => {
      this.setState({uploading: false})
      this.props.verifyUpload()
    })
  }

  render() {
    return (
      <div className='Upload'>
        <h1>Upload Photos</h1>
        <input type="file" name="file" accept='.jpg' onChange={this.handleFileSelect} multiple/><br />
        <input type="button" value="Upload" onClick={this.upload} />
      </div>
    )
  }
}

export default Upload
