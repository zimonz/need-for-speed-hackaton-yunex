import React, { FC } from 'react';
import { createUseStyles } from 'react-jss';

const ChartPlace: FC = () => {
    const classes = useStyles();

    return (
        <section
            className={[classes.chartPlaceholder, classes.empty].join(' ')}
        >
            <span className={classes.placeholder}>+</span>
        </section>
    );
};
const useStyles = createUseStyles({
    chartPlaceholder: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        backgroundColor: '#555',
    },
    empty: {
        '&:hover': {
            filter: 'brightness(0.9)',
            cursor: 'pointer',
        },
    },
    placeholder: {
        fontSize: '4em',
        color: '#fff',
        fontWeight: 'bold',
        opacity: 0.5,
    },
});

export default ChartPlace;
