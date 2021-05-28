import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import { urlSocket } from './api'
import { Container, IconButton, makeStyles, TextField, Typography, CircularProgress  } from '@material-ui/core'
import axios from 'axios'
import { Row, Col, Media } from 'react-bootstrap'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';
import { VideoPlayer } from './VideoPlayer'
import { User } from './User'
import SnackBar from './SnackBar'

const styles = makeStyles( (theme) => ({
    root: {
        paddingTop: theme.spacing(2)
    },
    appBar: {
        display: 'flex',
        alignItems: 'center',
    },
    backIcon: {
        marginRight: theme.spacing(1)
    },
    searchBtn: {
        borderRadius: theme.spacing(0),
        backgroundColor: '#303030',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '8px',
        paddingBottom: '8px',
        marginLeft: ''
    },
    // video section
    videoWrapper: {
        padding: theme.spacing(1),
        paddingTop: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            padding: 0,
            paddingTop: theme.spacing(3)
        },
        display: 'flex'
    },
    videoContainer: {
        width: '75%',
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    roomContainer: {
        width: '25%',
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    card: {
        width: "100%",
        padding: theme.spacing(1),
        cursor: 'pointer',
    },
    img: {
        width: "100%",
    },
    duration: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: theme.spacing(0.5),
        padding: theme.spacing(0.5),
        paddingBottom: 0,
        paddingTop: 0,
        borderRadius: "4px",
        backgroundColor: 'rgba(0,0,0,0.8)'
    },
    channelName: {
        color: '#aaaaaa'
    },
    iconChannel: {
        width: 45,
        borderRadius: '50%',
        marginRight: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            width: 35,
            marginRight: theme.spacing(2),
        }
    }
}))

export default function Room() {
    const socket = useRef( io(urlSocket) )

    const ref = useRef()
    const classes = styles()
    const history = useHistory()
    const location = useLocation()

    const room = location.pathname.split('/')[2]
    const username = localStorage.getItem("username")

    const [ notif, setNotif ] = useState('')
    const [ query, setQuery ] = useState("")
    const [ searching, setSearching ] = useState(false)
    const [ result, setResult ] = useState([])
    const [ video, setVideo ] = useState({
        playedBy: username,
        title: 'ReoNa - ANIMA / THE FIRST TAKE',
        channel: 'THE FIRST TAKE',
        url: 'https://www.youtube.com/watch?v=r-4XumkB2Yg',
        uploadedAt: 'Oct 9, 2020'
    })

    useEffect( () => {
        if(username === null) {
            history.push("/")
        } else {
            let data = { 
                room: room, 
                username: username 
            }
            socket.current.emit("join_room", data)
        }
    }, [history, room, username])

    useEffect(() => {
        socket.current.emit("total_user", room)
    })
    
    useEffect( () => {
        socket.current.emit("get_saved_url", room)
    }, [socket,room])

    useEffect( () => {
        socket.current.on("get_total_user", (data) => {
            if( data.length !== 1 ) setSavedUrl()
        })
    }, [socket, room])

    const setSavedUrl = () => {
        socket.current.on("receive_saved_url", (data) => {
            if(data !== null) {
                if(data.playedBy !== null && data.room === room) {
                    setVideo({
                        playedBy: data.playedBy,
                        title: data.title,
                        channel: data.channel,
                        url: data.url,
                        uploadedAt: data.uploadedAt
                    })
                }
            }
        })
    }

    useEffect( () => {
        socket.current.on("user_joined", (data) => {
            setNotif(data.notif)
        })

        socket.current.on("user_left", (data) => {
            setNotif(data.notif)
        })
    })

    const search = (e) => {
        e.preventDefault()
        setSearching(true)
        axios.post('https://senhai-music-server.herokuapp.com/search', { query: query })
        .then( res => { 
            // console.log(res.data)
            setResult(res.data.result)
            setSearching(false)
            ref.current.scrollIntoView({ behavior: 'smooth' })
        })
        .catch( err => console.error(err))
    }

    const selectVideo = (i) => {
        socket.current.emit("play_video", {
            room: room,
            url: i.url,
            title: i.title,
            direct: false,
            playedBy: username,
            channel: i.channel.name,
            uploadedAt: i.uploadedAt,
            ytVideo: true
        })
         let pause = {
            room: room,
            playerState: false
        }
        socket.current.emit("player_state",pause)
        setVideo({
            title: i.title,
            channel: i.channel.name,
            url: i.url,
            uploadedAt: i.uploadedAt,
            playedBy: username
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const leaveRoom = () => {
        let leave_user = {
            room: room,
            username: username
        }
        socket.current.emit('leave_room', leave_user)
        history.push('/')
    }

    return (
        <div>
        <Container maxWidth="lg" className={classes.root} >
            <form onSubmit={search} className={classes.appBar} >
                <div onClick={leaveRoom} >
                    <ArrowBackIcon className={classes.backIcon} />
                </div>
                <TextField 
                    color="primary"
                    placeholder="Search youtube title..."
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ style: { backgroundColor: '#121212'} }}
                    value={query}
                    onChange={ (e) => setQuery(e.target.value) }
                    autoComplete="false"
                />
                <IconButton type="submit" className={classes.searchBtn} disableFocusRipple >
                    {searching ? <CircularProgress size={22} color="inherit" /> : <SearchIcon />}
                </IconButton>
            </form>

            <div className={classes.videoWrapper} >
                <div className={classes.videoContainer} >
                    <VideoPlayer socket={socket} room={room} videoProps={video} />
                </div>

                <div className={classes.roomContainer} >
                    <User socket={socket} room={room} notif={notif} />
                </div>

            </div>

            <div ref={ref} >
               { searching ?
                <div>
                   <Typography>Searching...</Typography>
                </div>
                   :
                <Row xs={1} sm={3} md={4} lg={5} style={{ margin: 2 }} >
                    {result.map( (i,index) => (
                        <div key={index} >
                            <Col className={classes.card} >
                                <div 
                                    style={{ padding: 1}} 
                                    onClick={() => selectVideo(i)}
                                >
                                    <div style={{ position: 'relative' }} >
                                        <img src={i.thumbnail.url} alt={""} className={classes.img} />
                                        <Typography variant="inherit" className={classes.duration} >{i.duration_formatted}</Typography>
                                    </div>
                                    <Media style={{ marginTop: 10 }} >
                                        <img className={classes.iconChannel} src={i.channel.icon} alt="" /> 
                                        <Media.Body>
                                            <Typography variant="subtitle1" >{i.title}</Typography>
                                            <Typography className={classes.channelName} variant="subtitle2" >{i.channel.name}</Typography>
                                        </Media.Body>
                                    </Media>
                                </div>
                            </Col>
                        </div>
                    ) )}
                </Row>
                }
            </div>
        </Container>

        <SnackBar notif={notif} />

        </div>
    )
}