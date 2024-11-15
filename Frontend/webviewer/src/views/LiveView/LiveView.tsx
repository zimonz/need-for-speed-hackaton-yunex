import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import ChartPlace from '../../components/ChartPlace/ChartPlace';
import TireWearChart from '../../components/TireWearChart/TireWearChart';
import TrackPositionChart from '../../components/TrackPositionChart/TrackPositionChart';
import { IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const LiveView: React.FC = () => {
    const classes = useStyles();
    const [charts, setCharts] = useState<React.ReactNode[]>([]);

    useEffect(() => {
        setCharts([
            <ChartPlace key={1} />,
            <ChartPlace key={3} />,
            <TrackPositionChart position={1} key={4} />,
            <TireWearChart key={1} />,
        ]);
    }, []);
    return (
        <>
            <div className={classes.sidebar}>{/* <SideBar /> */}</div>
            <div className={classes.layout}>{charts.map(value => value)}</div>
            <div className={classes.pageChange}>
                <IconButton aria-label="home">
                    <KeyboardArrowDownIcon />
                </IconButton>
            </div>
        </>
    );
};

const useStyles = createUseStyles({
    sidebar: {
        width: '2vw',
        height: '100vh',
    },
    layout: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        height: '100vh',
        width: '98vw',
        flexWrap: 'wrap',
        fontFamily: 'Helvetica, sans-serif',
        '&>section': {
            width: '50%',
            height: '50vh',
        },
    },
    pageChange: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '5vh',
        width: '100vw',
        backgroundColor: '#fff',
        borderTop: '1px solid #ddd',
        position: 'fixed',
        bottom: 0,
        left: 0,
    },
});

export default LiveView;
