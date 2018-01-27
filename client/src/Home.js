import React , { Component } from 'react';
import Auth from './Auth';
import  axios from 'axios';
import './Programs.css';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Lock from 'material-ui/svg-icons/action/lock';
import Account from 'material-ui/svg-icons/action/account-box';

const input = {
   WebkitBoxShadow: '0 0 0 1000px lightgrey inset'
}

class Home extends Component {

  constructor(props) {
    super(props);
    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    this.state = {
      errors: {},
      successMessage,
      data: {
        user: '',
        password: '',
        solution: ''
      }
    };
  }


  processForm = (event) => {
    event.preventDefault();

    const user = encodeURIComponent(this.state.data.user);
    const password = encodeURIComponent(this.state.data.password);
    const solution = encodeURIComponent(this.state.data.solution);

    const formData = `user=${user}&password=${password}&solution=${solution}`;

    axios({
      method: 'post',
      url: '/filemaker-login',
      data: {formData}
    }).then(res => {
        console.log("SUCCES")
        this.setState({errors: {}
      });
      Auth.authenticateUser(res.token);
    }).catch(err => {
      console.log(err);
    })
  }

  changeData = (event) => {

    const field = event.target.name;
    const data = this.state.data;
    data[field] = event.target.value;

    this.setState({
      data
    });
  }

  render() {
    const {data, errors, successMessage} = this.state;

    return (
      <div className="login">
        <form action="" onSubmit={this.processForm}>
          <h2 className="card-heading">Authenticate with FM Solution</h2>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errors.summary && <p className="error-message">{errors.summary}</p>}

          <div className="field-line">
          <Account/>
            <TextField
              inputStyle={input}
              floatingLabelText="Enter User"
              name="user"
              fullWidth={true}
              errorText={errors.user}
              onChange={this.changeData}
              value={data.user}
            />
          </div>

          <Lock/>
          <div className="field-line">
            <TextField
              floatingLabelText="Enter Password"
              type="password"
              name="password"
              fullWidth={true}
              inputStyle={input}
              onChange={this.changeData}
              errorText={errors.password}
              value={data.password}
            />
          </div>

          <Lock/>
          <div className="field-line">
            <TextField
              floatingLabelText="Enter FM Solution"
              name="solution"
              fullWidth={true}
              inputStyle={input}
              onChange={this.changeData}
              errorText={errors.solution}
              value={data.solution}
            />
          </div>

          <div className="button-line">
            <RaisedButton type="submit" label="Authenticate" fullWidth={true} style={{marginTop:30, height:60}} primary />
          </div>
        </form>
      </div>
    );
  }
}

export default Home;