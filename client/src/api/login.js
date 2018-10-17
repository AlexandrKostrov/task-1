import axios from 'axios';

const login = data => {
  return axios.post('/chat', data).then(res => {
    return res;
    // console.log(res);
    // if (res.data.token) {
    //   localStorage.setItem('token', res.data.token);
    // } else {
    //   this.setState({ err: res.data.msg });
    //   throw new Error(res.data.msg);
    // }
  });
  // .then(() => history.push(`/chat`))
  // .catch(err => {
  //   console.log(err);
  // });
};

export default login;
