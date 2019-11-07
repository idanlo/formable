import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  React.useEffect(() => {
    axios({
      url: '/api/auth/test',
      method: 'GET'
      // url: '/api/auth/signup',
      // method: 'POST',
      // data: {
      //   email: 'idan21120@gmail.com',
      //   password: '1234567'
      // }
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err.response.data.message);
      });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
