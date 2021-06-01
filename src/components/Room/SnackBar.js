import React, { useEffect } from 'react'
import { useSnackbar } from 'notistack';

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
                variant: "info"
                
            });
        }
    }, [notif, enqueueSnackbar])

    return (
        <>
       
        </>
    )
}

export default SnackBar