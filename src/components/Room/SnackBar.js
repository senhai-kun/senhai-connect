import React, { useEffect } from 'react'
import { SnackbarProvider, useSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';
import { Button, Typography } from '@material-ui/core';

const SnackBar = ({ notif }) => {
    const { enqueueSnackbar } = useSnackbar();

    useEffect( () => {
        if(notif !== "") {
            enqueueSnackbar(notif, {
                anchorOrigin:{
                    vertical: 'bottom',
                    horizontal: 'left',
                },
                autoHideDuration: 3000,
                resumeHideDuration: 1500,
                persist: false,
                variant: "success"
                
            });
        }
    }, [notif, enqueueSnackbar])

    return (
        <>
       
        </>
    )
}

export default SnackBar