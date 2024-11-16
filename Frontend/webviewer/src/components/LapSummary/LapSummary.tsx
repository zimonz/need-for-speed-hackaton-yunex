import React from 'react';
import { createUseStyles } from 'react-jss';
import TrackMap from './TrackMap/TrackMap';
import LapTimes, { LapTime } from './LapTimes/LapTimes';

const LapSummary: React.FC = () => {
    const classes = useStyles();

    const lapTimes: LapTime[] = [
        { sector1: 30, sector2: 25, sector3: 28, total: 83 },
        { sector1: 32, sector2: 24, sector3: 27, total: 83 },
        { sector1: 31, sector2: 26, sector3: 29, total: 86 },
        { sector1: 29, sector2: 27, sector3: 26, total: 82 },
        { sector1: 33, sector2: 28, sector3: 30, total: 91 },
    ];

    return (
        <div className={classes.layout}>
            <div className={classes.track}>
                <TrackMap laptime={lapTimes[lapTimes.length - 1]} />
            </div>
            <div className={classes.lapTimes}>
                <LapTimes lapTimes={lapTimes} />
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    layout: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgb(75,75,75)',
    },
    track: {
        position: 'relative',
    },
    lapTimes: {
        flexGrow: 1,
        padding: '1em',
        margin: '1em',
    },
});

export default LapSummary;
