import React from 'react';
import './style.css'

const UserList = ({allUsers, socket}) => {

    const muteUser = (id) => () => {
        console.log(id);
        socket.emit('mute', id);
    }

    const unmuteUser = (id) => () => {
        console.log(id);
        socket.emit('unmute', id);
    }

     const banUser = (token) => () => {
         console.log(token);
         socket.emit('ban', token);
     }

     const unbanUser = (token) => () => {
        console.log(token);
        socket.emit('unban', token);
    }

    return (
      
        <ul className="list-group">
       { allUsers.map((user, index) => {
            return user.admin? (<div key={index}><img src={`${user.img}.jpg`} alt={user.nick}></img><li key={index}> {user.nick}</li> <p>Admin</p></div>):(
                <li key={index} className="list-group-item">
                <img src={user.img} alt={user.nick}></img>
                   {user.nick}
                   <button onClick={muteUser(user.id)} className="btn-md btn-warning">mute</button>
                   <button onClick={unmuteUser(user.id)} className="btn-md btn-warning">unmute</button>
                   <button onClick={banUser(user.id)} className="btn-md btn-danger">ban</button>   
                   <button onClick={unbanUser(user.id)} className="btn-md btn-danger">unban</button> 
                </li>
            )
        })}
        </ul>
    )
}

export default UserList;