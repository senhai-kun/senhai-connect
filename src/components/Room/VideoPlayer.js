import React, { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { Button, Divider, Hidden, makeStyles, TextField, Typography } from '@material-ui/core'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Collapse from '@material-ui/core/Collapse';
import { User } from './User'

const styles = makeStyles( (theme) => ({
    player: {
        backgroundColor: '#121212',
        height: 480,
        [theme.breakpoints.down('sm')]: {
            height: 320
        },
        [theme.breakpoints.down('xs')]: {
            height: 200
        },
    },
    titleContainer: {
        marginTop: theme.spacing(1),

    },
    actionContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    playBtn: {
        marginRight: theme.spacing(2),
        backgroundColor: '#A93226',
        color: 'white',
        '&:hover': {
            backgroundColor: '#A93226',
        },
    },
    roomBtn: {
        marginLeft: theme.spacing(2),
        backgroundColor: '#117A65',
        color: 'white',
        '&:hover': {
            backgroundColor: '#117A65',
        },
        [theme.breakpoints.up('md')]: {
            display: 'none'
        },
    },
    videoDetails: {
        display: 'flex',
        color: '#aaaaaa',
        alignItems: 'center',
        fontSize: 12
    },
    channel: {
        marginRight: theme.spacing(0.5),
    }
}))

export const VideoPlayer = ({ socket, room, videoProps }) => {
    const classes = styles()
    const videoRef = useRef()
    const username = localStorage.getItem("username")
    const [ users, setUsers ] = useState([])

    useEffect( () => {
        socket.current.on("get_total_user", (data) => {
            setUsers(data)
        })

    }, [socket, room])

    const [ video, setVideo ] = useState(videoProps)
    useEffect( () => {
        setVideo(videoProps)
        socket.current.on("url", (data) => {
            setVideo({
                title: data.title,
                channel: data.channel,
                url: data.url,
                uploadedAt: data.uploadedAt,
                playedBy: data.playedBy
            })
        })
    }, [videoProps,socket])

    const [ playing, setPlaying ] = useState(false)
    const [ directLink, setDirectLink ] = useState('')
    const [ openDirect, setOpenDirect ] = useState(false)
    const [ openRoom, setOpenRoom ] = useState(false)
    const [ seekBy, setSeekBy ] = useState('')
    const [ seeking, setSeeking ] = useState(false)

    useEffect( () => {
        socket.current.on("receive_player_state", (data) => {
            setPlaying(data)
        })
    }, [socket])

    const onPlay = () => {
        setPlaying(true)
        let play = {
            room: room,
            playerState: true
        }
        socket.current.emit("player_state",play)
    }
    const onPause = () => {
        let currentTime = videoRef.current.getCurrentTime()
        let seeking = {
            room: room,
            seek: Math.floor(currentTime),
            seekBy: username
        }
        socket.current.emit("seek", seeking )

        let pause = {
            room: room,
            playerState: false
        }
        socket.current.emit("player_state",pause)
        setPlaying(false)
    }

    useEffect( () => {
        let currentTime = videoRef.current.getCurrentTime()
        socket.current.on("receive_seek_time", (data) => {
          if(data.seek !== Math.floor(currentTime)) {
            setSeekBy(data.seekBy)
            setSeeking(true)
            if( videoProps.url !== '' ) {
                // if(username !== )
                videoRef.current.seekTo(data.seek)
                setSeeking(false)
            }
          }
        })
    }, [playing, videoProps.url, socket])

    const onEnded = () => {
        setPlaying(false)
    }

    const direct = (e) => {
        e.preventDefault()
        setVideo({
            title: 'Title unavailable',
            channel: '',
            url: directLink,
            uploadedAt: '',
        })
        console.log('asds')
    }

    return (
        <div >
            <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                <Typography>Played by: <span style={{ color: 'wheat' }} > {video.playedBy}</span></Typography>
                { seeking && <Typography>Seek by: <span style={{ color: 'wheat' }} > {seekBy}</span></Typography>}
            </div>
            <div className={classes.player} >
                <ReactPlayer 
                    ref={videoRef}
                    url={video.url}
                    width="100%"
                    height="100%"
                    controls
                    playing={playing}
                    onPlay={onPlay}
                    onSeek={() => {
                        setPlaying(false)
                    }}
                    // onProgress={ (e) => {
                    //     console.log("progress", e)
                    // } }
                    onPause={onPause}
                    onEnded={onEnded}
                />
            </div>

            <div className={classes.titleContainer} >
                <Typography style={{fontWeight: 'bold'}} >{video.title}</Typography>

                { video.title !== "" && 
                <div className={classes.videoDetails} >
                    <Typography className={classes.channel} variant="inherit" >{video.channel}</Typography>
                    <FiberManualRecordIcon fontSize="inherit" className={classes.channel} />
                    <Typography variant="inherit" >Uploaded {video.uploadedAt}</Typography>
                </div>
                }
            </div>

            <div className={classes.actionContainer} >
                <Button 
                    className={classes.playBtn} 
                    color="primary" 
                    variant="contained"
                    size="small" 
                    onClick={ playing ? onPause : onPlay }
                >
                    { playing ? <PauseIcon /> : <PlayArrowIcon />}
                </Button>
                
                <Button 
                    variant="contained" 
                    size="small" 
                    color="primary"  
                    onClick={() => {
                        openRoom && setOpenRoom(false)
                        setOpenDirect(!openDirect)
                    }}
                >
                    Direct
                </Button>

                <Button 
                    className={classes.roomBtn}
                    variant="contained" 
                    size="small" 
                    color="inherit" 
                    onClick={() => {
                        openDirect && setOpenDirect(false)
                        setOpenRoom(!openRoom)
                    }}
                >
                    Room
                </Button>
            </div>

            <Collapse in={openDirect} >
                <form onSubmit={direct} className={classes.actionContainer} style={{ marginBottom: 10 }} >
                    <TextField 
                        placeholder="Direct links here..."
                        variant="outlined"
                        fullWidth
                        size="small"
                        inputProps={{ style: { backgroundColor: '#121212' } }}
                        value={directLink}
                        onChange={ (e) => setDirectLink(e.target.value) }
                        autoComplete="false"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Play
                    </Button>
                </form>
            </Collapse>
            
            <Hidden mdUp >
                <Collapse in={openRoom} >
                    <form className={classes.actionContainer} style={{ marginBottom: 10 }} >
                        <User socket={socket} room={room} />
                    </form>
                </Collapse>
            </Hidden>
            <Divider 
                style={{
                    backgroundColor: '#303030',
                    marginTop: '5px',
                    marginBottom: '5px'
                }} 
                light={true} 
            />
        </div>
    )
}