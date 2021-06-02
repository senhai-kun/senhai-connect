import React, { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { Button, Divider, Hidden, makeStyles, TextField, Typography } from '@material-ui/core'
import { SliderHandle, SliderBar, Buffer } from './ProgressBar'
import { Slider, Direction, FormattedTime } from 'react-player-controls'
import screenfull from 'screenfull'
import { User } from './User'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Collapse from '@material-ui/core/Collapse';
import HomeIcon from '@material-ui/icons/Home';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

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
    playerControlBtn: {
        // marginRight: theme.spacing(2),
        backgroundColor: 'transparent',
        color: 'white',
        '&:hover': {
            backgroundColor: 'transparent',
        },
        padding: 0,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
        minWidth: 30
    },
    fullscreenBtn: {

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
    syncBtn: {
        backgroundColor: '#2E4053',
        marginLeft: theme.spacing(2),
        color: 'white',
        '&:hover': {
            color: '#283747',
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

const VideoPlayer = React.memo( ({ socket, room, videoProps, host }) => {
    const classes = styles()
    const videoRef = useRef()
    const username = localStorage.getItem("username")

    const [ duration, setDuration ] = useState(videoProps.length)
    const [ progress, setProgress ] = useState(0)
    const [ loaded, setLoaded ] = useState(0)
    const [ video, setVideo ] = useState(videoProps)
    const[ fullscreen, setFullscreen ] = useState(false)

    // directtly change video data
    useEffect( () => {
        setVideo(videoProps)
        socket.current.on("url", (data) => {
            setDuration(data.length)
            // console.log("server duration", data.length)
            setVideo({
                title: data.title,
                channel: data.channel,
                url: data.url,
                uploadedAt: data.uploadedAt,
                playedBy: data.playedBy,
                direct: data.direct,
                length: data.length
            })
        })
    }, [socket, videoProps])

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
    }, [playing, video])

    const onPlay = () => {
        // console.log("play")
        setPlaying(true)
        let play = {
            room: room,
            playerState: true
        }
        socket.current.emit("player_state",play)
    }
    const onPause = () => {
        // console.log("pause")
        let pause = {
            room: room,
            playerState: false
        }
        socket.current.emit("player_state",pause)
        setPlaying(false)
    }
    
    useEffect( () => {
        // console.log(videoRef.current.getCurrentTime())
        let seeking = {
            room: room,
            seek: videoRef.current.getCurrentTime(),
            seekBy: username
        }
        if(!playing) {
            host === username && socket.current.emit("seek", seeking )
        }

    }, [playing])

    useEffect( () => {
        let currentTime = videoRef.current.getCurrentTime()
        socket.current.on("receive_seek_time", (data) => {
            // if( host !== username ) {
                if(data.seek !== currentTime ) {
                    setSeekBy(data.seekBy)
                    setSeeking(true)
                    videoRef.current !== null && videoRef.current.seekTo(data.seek)
                    setSeeking(false)
                }
            // }
        })
    }, [playing, video.url])

    const onEnded = () => {
        setPlaying(false)
    }

    const direct = (e) => {
        e.preventDefault()
        socket.current.emit("play_video", {
            room: room,
            url: directLink,
            title: 'Title unavailable',
            direct: true,
            playedBy: username,
            channel: '',
            uploadedAt: ''
        })
        setVideo({
            title: 'Title unavailable',
            channel: '',
            url: directLink,
            uploadedAt: '',
            directLink: true
        })
    }

    return (
        <div >
            <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                <Typography>Played by: <span style={{ color: 'wheat' }} > {video.playedBy}</span></Typography>
                { seeking && <Typography>Seek by: <span style={{ color: 'wheat' }} > {seekBy}</span></Typography>}
            </div>
            <div id="video" className={classes.player} style={{position: 'relative'}} >
                <ReactPlayer   
                    ref={videoRef}
                    url={video.url}
                    width="100%"
                    height="100%"
                    // controls
                    playing={playing}
                    onStart={ (e) => {
                        // console.log("start", videoRef.current.getDuration())
                        setLoaded(0)
                    }}
                    onReady={ (e) => {
                        setProgress(0)
                        // console.log("ready", e.getInternalPlayer().getDuration())
                        setDuration(e.getDuration())
                    }}
                    onPlay={onPlay}
                    onPause={onPause}
                    onSeek={ (e) => {   
                        setPlaying(false)
                        console.log("seek", e)
                    }}
                    onProgress={ (e) => {
                        // console.log(e)
                        setLoaded(e.loaded)
                        setProgress(e.played)
                    }}
                    onBuffer={ () => {
                        console.log("buffer")
                    }}
                    onEnded={onEnded}
                />
                <div style={{
                    display: 'flex',
                    width: '100%',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }} >
                    <Button 
                        className={classes.playerControlBtn} 
                        color="primary" 
                        variant="contained"
                        size="small" 
                        onClick={ playing ? onPause : onPlay }
                        disableElevation
                    >
                        { playing ? <PauseIcon /> : <PlayArrowIcon />}
                    </Button>
                    <FormattedTime style={{ marginRight: 10}} numSeconds={ progress * (video.length / 1000)} />
                    <Slider
                        style={{
                            width: '100%',
                            height: 5,
                            borderRadius: 4,
                            background: "grey",
                            // transition: direction === Direction.HORIZONTAL ? 'width 0.1s' : 'height 0.1s',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scale(2.9)'
                            }
                        }}
                        direction={Direction.HORIZONTAL}
                        value={progress}
                        // onIntent={intent => console.log(`hovered at ${intent}`)}
                        // onIntentStart={intent => console.log(`entered with mouse at ${intent}`)}
                        // onIntentEnd={() => console.log('left with mouse')}
                        onChange={newValue => {
                            const time = Number(newValue) * (video.length / 1000)
                            let seeking = {
                                room: room,
                                seek: time,
                                seekBy: username
                            }
                            socket.current.emit("seek", seeking )
                            console.log("time", time)
                            console.log(duration)
                            videoRef.current.seekTo(time)
                            setProgress(newValue)
                        }}
                        onChangeStart={startValue => console.log(`started dragging at ${startValue}`)}
                        onChangeEnd={endValue => {
                            const time = Number(endValue) * (video.length / 1000)
                            let seeking = {
                                room: room,
                                seek: time,
                                seekBy: username
                            }
                            socket.current.emit("seek", seeking )
                            videoRef.current !== null && videoRef.current.seekTo(time)
                            setProgress(endValue)
                        } }
                    >
                        {/* <ProgressBar isEnabled value={progress} buffer={loaded} direction={Direction.HORIZONTAL}  /> */}
                        <SliderHandle value={progress}  />
                        <SliderBar value={progress} style={{ background: 'red' }} />
                        <Buffer value={loaded} />
                    </Slider>

                    <FormattedTime style={{ marginLeft: 10, marginRight: 5}} numSeconds={video.length / 1000} />
    
                    <Button 
                        className={classes.playerControlBtn} 
                        color="primary" 
                        variant="contained"
                        size="small" 
                        onClick={ () => {
                            setFullscreen(!fullscreen)
                            const el = document.getElementById("video")
                            screenfull.toggle(el)
                            window.screen.orientation.lock("landscape")
                        }}
                        disableElevation
                    >
                        { fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </Button>  
                </div>     
            </div>
                        
       
            
            <div className={classes.titleContainer} >
                <Typography style={{fontWeight: 'bold'}} >{video.title}</Typography>

                { video.title !== "" && 
                <div className={classes.videoDetails} >
                    <Typography className={classes.channel} variant="inherit" >{video.channel}</Typography>
                    { !video.direct && 
                        <>
                            <FiberManualRecordIcon fontSize="inherit" className={classes.channel} />
                            <Typography variant="inherit" >Uploaded {video.uploadedAt}</Typography>
                        </>
                    }

                </div>
                }
            </div>

            <div className={classes.actionContainer} >
                {/* <Button 
                    className={classes.playBtn} 
                    color="primary" 
                    variant="contained"
                    size="small" 
                    onClick={ playing ? onPause : onPlay }
                >
                    { playing ? <PauseIcon /> : <PlayArrowIcon />}
                </Button> */}
                
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
                    startIcon={<HomeIcon />}
                >
                    Room
                </Button>
                
                {/* { host !== username && <Sync />} */}

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
                    <div className={classes.actionContainer} style={{ marginBottom: 10 }} >
                        <User socket={socket} room={room} />
                    </div>
                </Collapse>
            </Hidden>
            
        </div>
    )
})

export default VideoPlayer