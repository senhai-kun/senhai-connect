import React, { useState } from 'react'
import { Button, Divider, makeStyles, TextField, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import CreateIcon from '@material-ui/icons/Create';

const styles = makeStyles( (theme) => ({
    btn: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        
    },
    userWrapper: {
        display: 'flex',

    },
    username: {
        color: 'wheat',
        alignItems: 'center',
        display: 'flex',
        marginLeft: theme.spacing(1),
        cursor: 'pointer'
    },
    icon: {
        marginLeft: '1px'
    }
}))

const JoinRoomContainer = ({ setChangeName }) => {
    const classes = styles()
    const history = useHistory()

    const [ room, setRoom ] = useState('')
    const [ username ] = useState(localStorage.getItem('username'))

    const joinRoom = () => {
        if( room !== "" && room !== " " ) {
            history.push(`/room/${room}`)
        }
    }

    // const createRoom = () => {

    // }
    
    return (
        <>
            <div className={classes.userWrapper} >
                <Typography variant="body1" >
                    Entering as:
                </Typography>
                <span onClick={() => setChangeName(true)} className={classes.username} > 
                    {username}
                    <CreateIcon className={classes.icon} fontSize="inherit" />
                </span>
            </div>

            <TextField 
                variant="outlined" 
                placeholder="Room Name" 
                helperText={ room !== "" && "Maximum of 10 charaters"}
                fullWidth
                inputProps={{ maxLength: 10 }}
                required
                value={room}
                onChange={ (e) => setRoom(e.target.value) }
            />

            <div>
                <Button 
                    disableElevation 
                    fullWidth 
                    color="inherit" 
                    variant="outlined" 
                    className={classes.btn}
                    size="large"
                    onClick={joinRoom}
                >
                    Join Room
                </Button>

                <Divider 
                    style={{
                        // height: '1px',
                        backgroundColor: '#5D6D7E',
                        marginTop: '5px',
                        marginBottom: '5px'
                    }} 
                    light={true} 
                    variant="middle" 
                />

                <Button 
                    disableElevation 
                    fullWidth 
                    color='inherit' 
                    variant="outlined" 
                    className={classes.btn}
                    size="large"
                >
                    Create Room
                </Button>

            </div>
        </>
    )
}

export default JoinRoomContainer