import React from 'react';
import axios from 'axios';

export default function facebookHoc (Component){
    return class extends React.Component {
        state = {err: ""};


        componentClicked = () => {
            console.log("clicked");
        }
    
        responseFacebook = response => {
           console.log(response);
           this.setState({
            isLoggedIn: true,
            userID: response.userID,
            name: response.name,
            email: response.email,
            picture: response.picture.data.url,
        });
           const data = {
                nick: response.name,
                email: response.email,
                password: response.userID,
                picture: response.picture.data.url,
                socialNet: true,
               }
            
           axios.post('/chat', data).then(res => {console.log(res);
                if(res.data.token)
                {localStorage.setItem('token', res.data.token);}
                else {
                   this.setState({err:res.data.msg}); 
                   throw new Error("This is not corect!");
                }
             }).then(()=>this.props.history.push(`/chat`)).catch(err=> { 
              this.setState({err: err}) 
              console.log(err)});   
        }

        render() {
            return (
                <Component {...this.props} facebookAuth={this.responseFacebook} componentClicked={this.componentClicked}/>
            )
        }
    }
}