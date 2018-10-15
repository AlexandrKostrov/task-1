import React from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import './style.css';

export default class FaceBut extends React.Component {
    state = {
        isLoggedIn: false,
        userID: '',
        name: '',
        email: '',
        picture: '',
        socials: true,
    }
    
    componentClicked = () => {
        console.log("clicked");
    }

    responseFacebook = response => {
       console.log(response);
       if(response.status !== "unknown"){
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
            socials: true,
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
          console.log(err)});   }
    }

    render() {

        let fbContent;

        if(this.state.isLoggedIn) {
            fbContent = (
                <div className="loggedIn">
                  <img src={this.state.picture} alt={this.state.name}/> 
                  <h2>Welcome {this.state.name}</h2>
                  Email: {this.state.email}
                </div>
            )
        }
        else {
            fbContent = (
                <FacebookLogin
                appId="1150700931772402"
                autoLoad={true}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook} />
            )
        }
        return (
            <div>
              {fbContent}
            </div>
        )
    }
}