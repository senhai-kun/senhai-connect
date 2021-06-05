import React, { useEffect, useState } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { CircularProgress, Button, makeStyles, TextField } from '@material-ui/core'
import axios from 'axios';
import { scroller } from 'react-scroll'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { urlSocket } from './api'

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
    const [ suggest, setSuggest ] = useState('')
    const [ open, setOpen ] = useState(false)

    useEffect( () => {
        axios.post(`${urlSocket}YTsuggest`, query)
        .then(res => {
            // console.log(res.data)
            setSuggest(res.data)
            setOpen(true)
        })
    }, [query])

    useEffect( () => {
        searching && setOpen(false)
    }, [searching])

    const search = (e) => {
        e.preventDefault()
        setOpen(false)
        setSearching(true)
        axios.post(`${urlSocket}search`, { query: query })
        .then( res => { 
            // console.log(res.data)
            setResult(res.data.result)
            setOpen(false)
            setSearching(false)
            scroller.scrollTo("search", {
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
            <Autocomplete 
                freeSolo
                fullWidth
                options={suggest}
                value={query}
                onChange={ (e) => setQuery(e.target.value), search }
                onClose={() => setOpen(false)}
                // autoHighlight
                open={open}
                // autoSelect={true}
                disableClearable
                renderInput={ (params) => (
                    <TextField 
                        {...params}
                        color="primary"
                        placeholder="Search youtube title..."
                        variant="outlined"
                        fullWidth
                        size="small"
                        // inputProps={{ style: { backgroundColor: '#121212'} }}
                        InputProps={{ ...params.InputProps, type: 'search', style: { backgroundColor: '#121212'} }}
                        value={query}
                        onChange={ (e) => setQuery(e.target.value) }
                    />
                )}
            />
           
            <Button type="submit" className={classes.searchBtn} disableFocusRipple >
                {searching ? <CircularProgress size={22} color="inherit" /> : <SearchIcon />}
            </Button>
        </form>
    )
}