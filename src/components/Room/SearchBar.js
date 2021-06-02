import React, { useState } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { CircularProgress, Button, makeStyles, TextField } from '@material-ui/core'
import axios from 'axios';
import Scroll from 'react-scroll'

const styles = makeStyles( (theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        width: '100%'
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
}))

export const SearchBar = ({ setResult, searching, setSearching }) => {
    const classes = styles();
    const [ query, setQuery ] = useState('')

    const scroll = Scroll.scroller

    const search = (e) => {
        e.preventDefault()
        setSearching(true)
        axios.post('https://senhai-connect-server.herokuapp.com/search', { query: query })
        .then( res => { 
            // console.log(res.data)
            setResult(res.data.result)
            setSearching(false)
            scroll.scrollTo("search", {
                duration: 100,
                delay: 0,
                smooth: true,
                // containerId: 'search'
            })
        })
        .catch( err => console.error(err))
    }

    return (
        <form onSubmit={search} className={classes.root} >
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
            <Button type="submit" className={classes.searchBtn} disableFocusRipple >
                {searching ? <CircularProgress size={22} color="inherit" /> : <SearchIcon />}
            </Button>
        </form>
    )
}