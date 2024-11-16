import React, { useContext, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import TrackMap from './TrackMap/TrackMap';
import LapTimes, { LapTime } from './LapTimes/LapTimes';
import { DataContext } from '../../contexts/DataContextProvider';

const LapSummary: React.FC = () => {
    const classes = useStyles();
    const { currentSector } = useContext(DataContext);

    const lapTimes: LapTime[] = [
        { sector1: 30, sector2: 25, sector3: 28, total: 83 },
        { sector1: 32, sector2: 24, sector3: 27, total: 83 },
        { sector1: 31, sector2: 26, sector3: 29, total: 86 },
        { sector1: 29, sector2: 27, sector3: 26, total: 82 },
        { sector1: 33, sector2: 28, sector3: 30, total: 91 },
    ];

    const fastestTimes: LapTime = useMemo(() => {
        return {
            sector1: Math.min(...lapTimes.map(lapTime => lapTime.sector1)),
            sector2: Math.min(...lapTimes.map(lapTime => lapTime.sector2)),
            sector3: Math.min(...lapTimes.map(lapTime => lapTime.sector3)),
            total: Math.min(...lapTimes.map(lapTime => lapTime.total)),
        };
    }, [lapTimes]);
    const slowestTimes: LapTime = useMemo(() => {
        return {
            sector1: Math.max(...lapTimes.map(lapTime => lapTime.sector1)),
            sector2: Math.max(...lapTimes.map(lapTime => lapTime.sector2)),
            sector3: Math.max(...lapTimes.map(lapTime => lapTime.sector3)),
            total: Math.max(...lapTimes.map(lapTime => lapTime.total)),
        };
    }, [lapTimes]);

    return (
        <div className={classes.layout}>
            <div className={classes.track}>
                <TrackMap
                    laptime={lapTimes[lapTimes.length - 1]}
                    currentSector={currentSector}
                    lapTimes={lapTimes}
                />
            </div>
            <div className={classes.lapTimes}>
                <LapTimes
                    lapTimes={lapTimes}
                    fastestTimes={fastestTimes}
                    slowestTimes={slowestTimes}
                />
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
        margin: 0,
        padding: 0,
        marginRight: '1rem',
    },
});

export default LapSummary;
