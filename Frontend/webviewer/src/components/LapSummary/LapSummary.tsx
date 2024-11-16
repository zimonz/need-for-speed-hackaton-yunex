import React from 'react';
import { createUseStyles } from 'react-jss';
import TrackMap from './TrackMap/TrackMap';
import LapTimes, { LapTime } from './LapTimes/LapTimes';

const LapSummary: React.FC = () => {
    const classes = useStyles();

    const lapTimes: LapTime[] = [
        { sector1: 30.0, sector2: 40.0, sector3: 50.0, total: 120.0 },
        { sector1: 31.0, sector2: 41.0, sector3: 51.0, total: 123.0 },
        { sector1: 32.0, sector2: 42.0, sector3: 52.0, total: 126.0 },
    ]; // Define lapTimes variable

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
