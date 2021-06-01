import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import { urlSocket } from './api'
import { Container, duration, makeStyles, Typography  } from '@material-ui/core'
import { Row, Col, Media } from 'react-bootstrap'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import VideoPlayer from './VideoPlayer'
import { User } from './User'
import SnackBar from './SnackBar'
import { SearchBar } from './SearchBar'
import { Element } from 'react-scroll'

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
    const [ host, setHost ] = useState('')

    const [ notif, setNotif ] = useState('')
    const [ searching, setSearching ] = useState(false)
    const [ result, setResult ] = useState([])
    const [ video, setVideo ] = useState({
        playedBy: username,
        title: '[MV] Red - Calliope Mori #HololiveEnglish #HoloMyth',
        channel: 'Mori Calliope Ch. hololive-EN',
        url: 'https://www.youtube.com/watch?v=-AuQZrUHjhg',
        uploadedAt: '1 month ago',
        length: 223000,
        direct: false
    })

    useEffect( () => {
        socket.current.on("connect_failed", () => {
            alert("failed to connect")
        })
        socket.current.on("connect", () => {
            console.log(socket.current) 
          });
    }, [])

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
    
    useEffect( () => {
        socket.current.emit("total_user", room)
        socket.current.emit("get_saved_url", room)
    }, [notif, room])
    
    // useEffect( () => {
    //     socket.current.emit("get_saved_url", room)
    // }, [socket, room])


    useEffect( () => {      
        const setSavedUrl = () => {
            socket.current.on("receive_saved_url", (data) => {
                if(data !== null) {
                    if(data.playedBy !== null && data.room === room) {
                        setVideo({
                            playedBy: data.playedBy,
                            title: data.title,
                            channel: data.channel,
                            url: data.url,
                            uploadedAt: data.uploadedAt,
                            direct: data.direct,
                            length: data.length
                        })
                    }
                }
            })
        }
        socket.current.on("get_total_user", (data) => {
            setHost(data[0].username)
            if( data.length !== 1 ) setSavedUrl()
        })
    }, [socket, room, video])


    useEffect( () => {
        socket.current.on("user_joined", (data) => {
            setNotif(data.notif)
        })

        socket.current.on("user_left", (data) => {
            setNotif(data.notif)
        })
    }, [notif])

    const selectVideo = (i) => {
        socket.current.emit("play_video", {
            room: room,
            url: i.url,
            title: i.title,
            direct: false,
            playedBy: username,
            channel: i.channel.name,
            uploadedAt: i.uploadedAt,
            length: i.duration,
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
            playedBy: username,
            length: i.duration,
            direct: false
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
            <div className={classes.appBar} >
                <div onClick={leaveRoom} >
                    <ArrowBackIcon className={classes.backIcon} />
                </div>

                <SearchBar setResult={setResult} searching={searching} setSearching={setSearching} />
            </div>

            <div className={classes.videoWrapper} >
                <div className={classes.videoContainer} >
                    {/* {player} */}
                    <VideoPlayer socket={socket} room={room} videoProps={video} host={host} />
                </div>

                <div className={classes.roomContainer} >
                    <User socket={socket} room={room} notif={notif} />
                </div>

            </div>

            <Element id="search" ref={ref} >
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
                                            <Typography className={classes.channelName} variant="subtitle2">{i.uploadedAt}</Typography>
                                        </Media.Body>
                                    </Media>
                                </div>
                            </Col>
                        </div>
                    ) )}
                </Row>
                }
            </Element>
        </Container>

        <SnackBar notif={notif} />

        </div>
    )
}