import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { DataContext } from '../../contexts/DataContextProvider';

const SpeedTracker: React.FC = () => {
    const classes = useStyles();
    const { speed, gear } = useContext(DataContext);

    return (
        <section
            style={{
                backgroundColor: 'rgb(200,200,200)',
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
                <h1 className={classes.indicator}>Gear {gear.toFixed(0)}</h1>
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
