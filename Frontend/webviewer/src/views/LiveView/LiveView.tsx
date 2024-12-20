import React, { ReactNode, useContext, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import BarChart from '../../components/TireWearChart/TireWearChart';
import TrackPositionChart from '../../components/TrackPositionChart/TrackPositionChart';
import { DataContext } from '../../contexts/DataContextProvider';
import SpeedChart from '../../components/SpeedChart/SpeedChart';
import SteeringWheel from '../../components/SteeringWeel/SteeringWeel';

const LiveView: React.FC = () => {
    const classes = useStyles();
    const {
        tireWear,
        middlePosition,
        rotation,
        brakes,
        throttle,
        steeringWheelPosition,
        middleAngleHistory,
        middleDistanceHistory,
    } = useContext(DataContext);

    const chartComponents = useMemo(
        (): ReactNode[] => [
            <BarChart
                labels={['Tire wear', 'Throttle', 'Brakes']}
                dataSet={[tireWear, throttle, brakes]}
                criticalThreshold={70}
                neutralThreshold={50}
                key={1}
                title={''}
            />,
            <SteeringWheel
                key={2}
                steeringWheelPosition={steeringWheelPosition}
            />,
            <TrackPositionChart
                position={middlePosition}
                rotation={rotation}
                key={3}
            />,
            <SpeedChart
                additionalDataSets={[
                    {
                        label: 'Angle to middle',
                        borderColor: 'rgb(192, 75, 192)',
                        data: middleAngleHistory,
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: 'Distance to middle',
                        borderColor: 'rgb(192, 192, 75)',
                        data: middleDistanceHistory,
                        fill: false,
                        tension: 0.1,
                    },
                ]}
                key={4}
            />,
        ],
        [
            tireWear,
            throttle,
            brakes,
            steeringWheelPosition,
            middlePosition,
            rotation,
            middleAngleHistory,
            middleDistanceHistory,
        ]
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
