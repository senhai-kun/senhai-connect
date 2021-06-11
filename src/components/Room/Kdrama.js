import React, { useState } from 'react'
import { Button, Collapse, makeStyles, TextField, Typography } from '@material-ui/core'
import axios from 'axios'
import { urlSocket } from './api'
import { Col, Row } from 'react-bootstrap'

const styles = makeStyles( (theme) => ({
    card: {
        width: "100%",
        padding: theme.spacing(1),
        cursor: 'pointer',
    },
    img: {
        width: "100%",
        height: 200
    }
}))

export const Kdrama = React.memo( ({ socket, open, css, room, setVideo, control, setControl}) => {
    const classes = styles()
    const [ query, setQuery ] = useState("")
    const [ result, setResult ] = useState([])
    const [ check, setCheck ] = useState()
    const [ hideResult, setHideResult ] = useState(false)
    const [ episode, setEpisode ] = useState()

    const searchKdrama = (e) => {
        e.preventDefault()
        setHideResult(false)
        axios.post(`${urlSocket}kdramaSearch`, { title: query })
        .then( res => {
            // console.log(res.data.results)
            setResult(res.data.results)
        })
        .catch( err => console.error(err))
    }

    const getEpisode = async (i) => {
        // console.log(i)
        await axios.post(`${urlSocket}kdramaInfo`, { id: i.id })
        .then( res => {
            // console.log(res.data.episode)
            setEpisode(res.data.episode)
        })
        .catch( err => console.error(err))
        setHideResult(true)

    }

    const checkInfo = (index) => {
        setCheck(result[index])
        getEpisode(result[index])

    }

    const getWatchLink = (i) => {
        const username = localStorage.getItem("username")

        axios.post(`${urlSocket}kdramaWatch`, { epID: i.epID })
        .then( res => {
            // console.log(res.data)
            socket.current.emit("play_video", {
                room: room,
                url: res.data.watch[0].link,
                title: i.name,
                direct: true,
                playedBy: username,
                channel: '',
                uploadedAt: ''
            })
            let pause = {
                room: room,
                playerState: false
            }
            socket.current.emit("player_state",pause)
            setVideo({
                room: room,
                url: res.data.watch[0].link,
                title: i.name,
                direct: true,
                playedBy: username,
                channel: '',
                uploadedAt: ''
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        })
        .catch( err => console.error(err))
    }

    return (
        <Collapse in={open} >
            <Button size="small" onClick={ () => setControl(!control) } >{control ? "Controls on" : "Controls off"}</Button>
            
            <form onSubmit={searchKdrama} className={css} style={{ marginBottom: 10 }} >
                <TextField 
                    placeholder="Search k-drama title..."
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ style: { backgroundColor: '#121212' } }}
                    autoComplete="false"
                    value={query}
                    onChange={ (e) => setQuery(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                >
                    K_Search
                </Button>
            </form>

            {/* <div style={{ border: "1px solid white" }} > */}
           { !hideResult && <Row xs={2} sm={3} md={4} lg={5} style={{ margin: 2, border: "1px solid white" }} >
                { result.length !== 0 && result.map( (i,index) => (
                    <Col key={i.id} className={classes.card} onClick={ () => checkInfo(index)} >
                        <img src={i.img} alt="" className={classes.img} />
                        <Typography>{i.title}</Typography> 
                    </Col>
                )) }
            </Row> }

            { hideResult && <div style={{ textAlign: 'center', border: "1px solid white" }} >
                <img src={check.img} alt=""  style={{ width: 200 }} />
                <Typography>{check.title}</Typography>
                { episode.map( (i) => (
                    <div key={i.epID} >
                        <Button 
                            variant='outlined' 
                            style={{ margin: 5 }}  
                            onClick={ () => getWatchLink(i) }
                        >
                            {i.name}
                        </Button>
                    </div>
                )) }
            </div> }
            {/* </div> */}

        </Collapse>
    )
})