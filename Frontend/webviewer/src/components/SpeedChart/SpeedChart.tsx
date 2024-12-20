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

interface SpeedChartProps {
    additionalDataSets?: {
        label: string;
        data: number[];
        fill: false;
        borderColor: string;
        tension: number;
    }[];
}

const SpeedChart: React.FC<SpeedChartProps> = ({ additionalDataSets = [] }) => {
    const classes = useStyles();
    const { speedHistory } = useContext(DataContext);

    const data: ChartData<'line'> = useMemo(
        () => ({
            labels: speedHistory.map(
                (_, index) => `${speedHistory.length - index - 1}`
            ),
            datasets: [
                {
                    label: 'Speed',
                    data: speedHistory,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
                ...additionalDataSets,
            ],
        }),
        [additionalDataSets, speedHistory]
    );

    const options: ChartOptions<'line'> = {
        responsive: true,
        animation: {
            easing: 'linear',
            duration: 0,
        },
        plugins: {
            legend: {
                position: 'top',
                // display: false,
            },
            title: {
                display: false,
                text: 'Speed',
            },
        },
        elements: {
            point: {
                // radius: 0,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 250,
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
