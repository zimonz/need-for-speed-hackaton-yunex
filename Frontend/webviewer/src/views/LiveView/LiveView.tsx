import React, { ReactNode, useContext, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import BarChart from '../../components/TireWearChart/TireWearChart';
import TrackPositionChart from '../../components/TrackPositionChart/TrackPositionChart';
import SpeedTracker from '../../components/SpeedTracker/SpeedTracker';
import { DataContext } from '../../contexts/DataContextProvider';

const LiveView: React.FC = () => {
    const classes = useStyles();
    const { tireWear, engineTemp, middlePosition } = useContext(DataContext);

    const chartComponents = useMemo(
        (): ReactNode[] => [
            <BarChart
                dataSet={engineTemp}
                criticalThreshold={70}
                neutralThreshold={50}
                key={1}
                title={'Engine temperature'}
            />,
            <BarChart
                dataSet={tireWear}
                criticalThreshold={70}
                neutralThreshold={50}
                key={2}
                title={'Tire wear'}
            />,
            <TrackPositionChart position={middlePosition} key={3} />,
            <SpeedTracker key={4} />,
        ],
        [tireWear, engineTemp, middlePosition]
    );
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                width: '100%',
                height: '100%',
            }}
        >
            <div className={classes.layout}>
                {chartComponents.map(value => value)}
            </div>
        </div>
    );
};

const useStyles = createUseStyles({
    layout: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: '100vh',
        width: '100vw',
        flexWrap: 'wrap',
        fontFamily: 'Helvetica, sans-serif',
        boxSizing: 'border-box',
        '&>section': {
            width: '50%',
            height: '50%',
        },
    },
});

export default LiveView;
