import React from 'react';
import SteeringWheelSvg from '../../assets/Formula_one_steering_wheel_front.svg?react';
import { createUseStyles } from 'react-jss';

const SteeringWheel: React.FC<{
    steeringWheelPosition: number;
}> = ({ steeringWheelPosition }) => {
    const classes = useStyles();

    console.log(steeringWheelPosition);

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
                <SteeringWheelSvg width={'50%'} height={'50%'} />
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
