import React from 'react';
// import axios from 'axios';
import Header from './containers/Header';
import FormBuilder from './containers/FormBuilder';
import './App.css';

const App: React.FC = () => {
  // React.useEffect(() => {
  //   axios({
  //     url: '/api/auth/test',
  //     method: 'GET'
  //     // url: '/api/auth/signup',
  //     // method: 'POST',
  //     // data: {
  //     //   email: 'idan21120@gmail.com',
  //     //   password: '1234567'
  //     // }
  //   })
  //     .then(res => {
  //       console.log(res);
  //     })
  //     .catch(err => {
  //       console.log(err.response.data.message);
  //     });
  // }, []);

  return (
    <div>
      <Header />
      <FormBuilder />
    </div>
  );
};

export default App;
