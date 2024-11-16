import React, { useContext, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import { createUseStyles } from 'react-jss';
import { DataContext } from '../../contexts/DataContextProvider';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SpeedChart: React.FC = () => {
    const classes = useStyles();
    const { speedHistory } = useContext(DataContext);

    const data: ChartData<'line'> = useMemo(
        () => ({
            labels: speedHistory.map(
                (_, index) => `${speedHistory.length - index - 1}s`
            ),
            datasets: [
                {
                    label: 'Speed',
                    data: speedHistory,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
            ],
        }),
        [speedHistory]
    );

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: true,
                text: 'Speed',
            },
        },
    };

    return (
        <section className={classes.chart}>
            <Line data={data} options={options} />
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

export default SpeedChart;
