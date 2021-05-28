import React, { useEffect, useState } from 'react'
import { ImageBackground } from './ImageBackground'
import { Box, Container, makeStyles, Paper, Typography } from '@material-ui/core'
import JoinRoomContainer from './JoinRoomContainer'
import User from './User'
// import { motion } from "framer-motion";

const styles = makeStyles( (theme) => ({
    root: {

    },
    titleContainer: {
        marginBottom: theme.spacing(3)
    },
    title: {
        fontWeight: 'bold',
    },
    paper: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '15px',
        borderRadius: '8px'
    }
}))

export default function JoinRoom() {
    const classes = styles()
    const [ changeName, setChangeName ] = useState(false)
    const username = localStorage.getItem("username")

    useEffect( () => {
        username === null && setChangeName(true)
    }, [username])

    return (
        <div>
            <ImageBackground>
                <Container maxWidth="sm" >
                    <Box className={classes.titleContainer} >
                        <Typography variant='h4' className={classes.title} >Senhai Connect</Typography>
                        <Typography variant='body2' >Watch videos together</Typography>
                    </Box>
                    
                    <Paper className={classes.paper} >
                        { changeName ? 
                            <User setChangeName={setChangeName} /> 
                            : 
                            <JoinRoomContainer setChangeName={setChangeName} /> 
                        }
                    </Paper>

                </Container>
            </ImageBackground>
        </div>
    )
}