import React, { useEffect, useState } from 'react'
import { makeStyles, Typography, Paper, Divider } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';

const styles = makeStyles( (theme) => ({
    root: {
        width: '100%',
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            padding: 0
        }
    },
    paper: {
        backgroundColor: '#303030',
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
    },
    roomName: {
        color: 'wheat',
        marginLeft: theme.spacing(1)
    },
    users: {
        padding: theme.spacing(1)
    }
}))

export const User = React.memo( ({ socket, room, notif }) => {
    const classes = styles()
    const [ users, setUsers ] = useState([])
    const [ load, setLoad ] = useState(true)
    const username = localStorage.getItem("username")

    useEffect( () => {
        socket.current.on("get_total_user", (data) => {
            setUsers(data)
            setLoad(false)
        })

    }, [socket, room, notif])

    useEffect( () => {
        socket.current.emit("total_user", room)

    }, [room, socket])

    return (
        <div className={classes.root} >
            <Paper className={classes.paper} >
                <HomeIcon fontSize="small" style={{ marginRight: 3 }} />
                <Typography>Room: </Typography>
                <Typography className={classes.roomName} >{room}</Typography>
            </Paper>
            
            <div className={classes.users} >
                <Typography>Host: <span style={{color: 'wheat'}} > {load ? '' : users[0].username}</span></Typography>

                <Divider 
                    style={{
                        backgroundColor: '#303030',
                        marginTop: '5px',
                        marginBottom: '5px'
                    }} 
                    light={true} 
                    // variant="middle" 
                />
                
                <Typography>Active Users: </Typography>
                
                <div>
                    {users.map( (i,index) => (
                        <Typography key={index} >{i.username} { username === i.username && <span>(you)</span>} </Typography>
                    ))}
                </div>
            </div>
        </div>
    )
})