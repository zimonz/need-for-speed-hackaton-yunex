import IconButton from '@mui/material/IconButton';
import React from 'react';
import { createUseStyles } from 'react-jss';
import TireRepairIcon from '@mui/icons-material/TireRepair';

const SideBar: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.sidebar}>
            <IconButton aria-label="home">
                <TireRepairIcon />
            </IconButton>
        </div>
    );
};

const useStyles = createUseStyles({
    sidebar: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});

export default SideBar;
