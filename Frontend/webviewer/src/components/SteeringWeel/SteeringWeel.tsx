import React, { useContext } from 'react';
// import SteeringWheelSvg from '../../assets/Formula_one_steering_wheel_front.svg?react';
import { createUseStyles } from 'react-jss';
import SteeringWheelSvg from './SteeringWheelSvg';
import { DataContext } from '../../contexts/DataContextProvider';

const SteeringWheel: React.FC<{
    steeringWheelPosition: number;
}> = ({ steeringWheelPosition }) => {
    const classes = useStyles();
    const { gear, speed } = useContext(DataContext);

    return (
        <section className={classes.chart}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    transform: `rotate(${steeringWheelPosition}deg)`,
                    transition: 'all 0.5s ease',
                }}
            >
                <SteeringWheelSvg
                    height={'60%'}
                    width={'60%'}
                    gear={gear}
                    speed={speed.toFixed(0)}
                />
                {/* <SteeringWheelSvg width={'50%'} height={'50%'} /> */}
            </div>
        </section>
    );
};

const useStyles = createUseStyles({
    chart: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
    },
});
export default SteeringWheel;
