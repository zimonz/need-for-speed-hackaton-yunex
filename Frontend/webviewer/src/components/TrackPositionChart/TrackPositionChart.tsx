import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { DataContext } from '../../contexts/DataContextProvider';

interface TrackPositionChartProps {
    position: number;
    rotation?: number;
}

const indicatorSize: number = 8;
const koefficient: number = 4.5;

const TrackPositionChart: React.FC<TrackPositionChartProps> = ({
    position,
    rotation = 0,
}) => {
    const { carFailure } = useContext(DataContext);
    const classes = useStyles();

    return (
        <section className={classes.chart}>
            <div className={classes.chartArea}>
                <span className={classes.yAxis}></span>
                <span className={classes.xAxis}></span>
                <span
                    className={classes.indicator}
                    style={{
                        left: `Min(calc(50% + ${position * koefficient}% - ${
                            indicatorSize / 2.5
                        }vw), 100%)`,
                        transition: 'all 0.5s ease',
                        transform: `rotate(${rotation}deg)`,
                        borderBottom: `${indicatorSize}vw solid ${
                            carFailure ? 'tomato' : 'rgb(50, 200, 50)'
                        }`,
                    }}
                >
                    <span
                        style={{
                            position: 'relative',
                            top: `${indicatorSize / 1.4}vw`,
                            color: 'white',
                            fontSize: '1rem',
                            transition: 'all 0.5s ease',
                            transform: `rotate(-${rotation}deg)`,
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
        backgroundColor: '#555',
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
        position: 'absolute',
        width: 10,
        height: '80%',
        left: 'calc(50% - 5px)',
        background:
            'repeating-linear-gradient(0deg,white 0px,white 15px,transparent 15px,transparent 30px)',
    },
    xAxis: {
        position: 'absolute',
        width: '80%',
        height: '80%',
        borderLeft: '3px solid #999',
        borderRight: '3px solid #999',
    },
    indicator: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderLeft: `${indicatorSize / 2.5}vw  solid transparent`,
        borderRight: `${indicatorSize / 2.5}vw  solid transparent`,
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
