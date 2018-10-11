import React from 'react';

const UserList = ({allUsers, socket}) => {

    const muteUser = (nick) => () => {
        console.log(nick);
        socket.emit('mute',nick);
    }

    // const muteUser = (nick) => () => {
    //     console.log(nick);
    //     socket.emit('mute',nick);
    // }

    return (
      
        <ul>
       { allUsers.map((user, index) => {
            return (
                <li key={index}>
                   {user.nick}
                   <button onClick={muteUser(user.nick)}>mute</button>
                   {/* <button onClick={banUser(user.nick)}>mute</button> */}
                </li>
            )
        })}
        </ul>
    )
}

export default UserList;