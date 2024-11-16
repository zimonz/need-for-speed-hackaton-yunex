import React from 'react';
import { createUseStyles } from 'react-jss';

interface TrackPositionChartProps {
    position: number;
}

const indicatorSize: number = 5;
const koefficient: number = 2;

const TrackPositionChart: React.FC<TrackPositionChartProps> = ({
    position,
}) => {
    const classes = useStyles();

    return (
        <section className={classes.chart}>
            <span>Track Position Chart</span>

            <div className={classes.chartArea}>
                <span className={classes.yAxis}></span>
                <span className={classes.xAxis}></span>
                <span
                    className={classes.indicator}
                    style={{
                        left: `calc(50% - ${position * koefficient * -1}% - ${
                            indicatorSize / 2
                        }vw)`,
                    }}
                >
                    <span
                        style={{
                            position: 'relative',
                            top: `${indicatorSize / 1.4}vw`,
                            color: 'white',
                            fontSize: '1.1rem',
                        }}
                    >
                        {position.toFixed(1)}m
                    </span>
                </span>
            </div>
        </section>
    );
};

const useStyles = createUseStyles({
    chart: {
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '1em',
        boxSizing: 'border-box',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgb(220,220,220)',
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
        backgroundColor: '#666',
    },
    xAxis: {
        bottom: 10,
        width: '100%',
        height: 1,
        backgroundColor: '#000',
    },
    indicator: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderLeft: `${indicatorSize / 2}vw  solid transparent`,
        borderRight: `${indicatorSize / 2}vw  solid transparent`,
        borderBottom: `${indicatorSize}vw solid black`,
        color: 'rgb(150,150,150)',
        margin: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default TrackPositionChart;
