import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';

interface TrackPositionChartProps {
    position: number;
}

const TrackPositionChart: React.FC<TrackPositionChartProps> = ({
    position,
}) => {
    const classes = useStyles();

    useEffect(() => {
        console.log(position);
    }, [position]);

    return (
        <section className={classes.chart}>
            <span>Track Position Chart</span>
            <div className={classes.chartArea}>
                <span className={classes.yAxis}></span>
                <span className={classes.xAxis}></span>
            </div>
        </section>
    );
};

const useStyles = createUseStyles({
    chart: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '1em',
        boxSizing: 'border-box',
        height: '50vh',
        width: '50vw',
    },
    chartArea: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    yAxis: {
        bottom: 10,
        width: 1,
        height: '100%',
        backgroundColor: '#000',
    },
    xAxis: {
        bottom: 10,
        width: '100%',
        height: 1,
        backgroundColor: '#000',
    },
});
export default TrackPositionChart;
