import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      password: '',
      user: null,
      view: 'login'
    }
  }

  async componentDidMount() {
   let response = await axios.get('/auth/current')
   this.setState({
     user: response.data
   })
  }

  handleChange = e => {
    let { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  handleLogin = async () => {
    const { email, password } = this.state
    let response = await axios.post('/auth/login', { email, password })
    this.setState({
      email: '',
      password: '',
      user: response.data
    })
  }

  handleLogout = async () => {
    await axios.get('/auth/logout')
    this.setState({
      user: null,
      view: 'login'
    })
  }

  handleSignup = async () => {
    const { email, password, name } = this.state
    let response = await axios.post('/auth/signup', { email, password, name })
    this.setState({
      email: '',
      password: '',
      name: '',
      user: response.data
    })
  }

  toggleView = () => {
    this.setState({
      view: this.state.view === 'login' ? 'signup' : 'login'
    })
  }

  render() {
    return (
      <div className="App">
        {
          this.state.user ?
          <div>
            <h1>Welcome, { this.state.user.name }</h1>
            <button onClick={this.handleLogout}>logout</button>
          </div> : this.state.view === 'login' ?
          <div>
            <h1>Login</h1>
            <input type="text" name="email" placeholder="email" onChange={this.handleChange} value={this.state.email}/>
            <input type="password" name="password" placeholder="password" onChange={this.handleChange} value={this.state.password}/>
            <button onClick={this.handleLogin}>login</button>
            <p>Don't have an account? <a href="#/register" onClick={this.toggleView}>click here</a></p>
          </div> :
          <div>
            <h1>Signup</h1>
            <input type="text" name="name" placeholder="name" onChange={this.handleChange} value={this.state.name}/>
            <input type="text" name="email" placeholder="email" onChange={this.handleChange} value={this.state.email}/>
            <input type="password" name="password" placeholder="password" onChange={this.handleChange} value={this.state.password}/>
            <button onClick={this.handleSignup}>signup</button>
            <p>Already have an account? <a href="#/login" onClick={this.toggleView}>click here</a></p>
          </div>
        }
      </div>
    );
  }
}
export default App;
