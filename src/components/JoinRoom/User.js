import { Button, makeStyles, TextField } from '@material-ui/core'
import React, { useState } from 'react'

const styles = makeStyles( (theme) => ({
    btn: {
        marginTop: theme.spacing(2)
    }
}))

const User = ({ setChangeName }) => {
    const classes = styles()
    const activeUsername = localStorage.getItem("username")

    const [ username, setUsername ] = useState(activeUsername === null ? "" : activeUsername)

    const createUsername = (e) => {
        e.preventDefault()
        if(username !== "" && username !== " ") {
            localStorage.setItem("username", username)
            setChangeName(false)
        }
    }

    return (
        <form onSubmit={createUsername} >
            <TextField 
                placeholder="Username"
                variant="outlined"                
                fullWidth
                inputProps={{ maxLength: 12 }}
                value={username}
                helperText={ username !== "" && "Maximum of 12 characters."}
                onChange={(e) => setUsername(e.target.value)}
            />

            <Button
                variant="outlined"
                color="inherit"
                fullWidth
                className={classes.btn}
                size="large"
                type="submit"
            >
                Set as Username
            </Button>
        </form>
    )
}

export default User