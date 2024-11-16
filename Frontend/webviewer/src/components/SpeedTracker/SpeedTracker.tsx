import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';

const SpeedTracker: React.FC = () => {
    const [speed, setSpeed] = useState<number>(0);
    const classes = useStyles();

    useEffect(() => {
        setSpeed(Math.random() * 100);
    }, []);

    return (
        <section
            style={{
                backgroundColor: 'lightblue',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                <h1 className={classes.indicator}>{speed.toFixed(2)} km/h</h1>
                <h1 className={classes.indicator}>{speed.toFixed(0)}. Gear</h1>
            </div>
        </section>
    );
};

const useStyles = createUseStyles({
    indicator: {
        color: 'rgb(100,100,100)',
        fontSize: '4rem',
        margin: 0,
    },
});

export default SpeedTracker;
