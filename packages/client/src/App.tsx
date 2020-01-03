import React from 'react';
import axios from 'axios';
import Header from './containers/Header';
import FormBuilder from './containers/FormBuilder/FormBuilder';
import './App.css';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(true);

  React.useEffect(() => {
    axios({
      // url: '/api/auth/test',
      // method: 'GET'
      // url: '/api/auth/signup',
      // method: 'POST',
      // data: {
      //   email: 'idan21120@gmail.com',
      //   password: '1234567'
      // }
      url: '/api/auth/is-logged',
      method: 'GET'
    })
      .then(res => {
        setAuthenticated(true);
        setLoading(false);
        console.log(res);
      })
      .catch(err => {
        setAuthenticated(false);
        setLoading(false);
        console.log(err.response.data.message);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : authenticated ? (
        <>
          <Header />
          <FormBuilder />
        </>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  );
};

export default App;
