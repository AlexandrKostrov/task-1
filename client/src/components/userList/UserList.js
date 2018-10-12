import React from 'react';

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
      
        <ul>
       { allUsers.map((user, index) => {
            return user.admin? (<div key={index}><li key={index}> {user.nick}</li> <p>Admin</p></div>):(
                <li key={index}>
                   {user.nick}
                   <button onClick={muteUser(user.token)}>mute</button>
                   <button onClick={banUser(user.token)}>ban</button>    
                </li>
            )
        })}
        </ul>
    )
}

export default UserList;