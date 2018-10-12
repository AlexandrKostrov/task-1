import React from 'react';
import './style.css'

const UserList = ({allUsers, socket}) => {

    const muteUser = (token) => () => {
        console.log(token);
        socket.emit('mute', token);
    }

     const banUser = (token) => () => {
         console.log(token);
         socket.emit('ban', token);
     }

    return (
      
        <ul className="list-group">
       { allUsers.map((user, index) => {
            return user.admin? (<div key={index}><li key={index}> {user.nick}</li> <p>Admin</p></div>):(
                <li key={index} className="list-group-item">
                   {user.nick}
                   <button onClick={muteUser(user.token)} className="btn-md btn-warning">mute</button>
                   <button onClick={banUser(user.token)} className="btn-md btn-danger">ban</button>    
                </li>
            )
        })}
        </ul>
    )
}

export default UserList;