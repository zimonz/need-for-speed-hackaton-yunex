import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { createUseStyles } from 'react-jss';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TireWearChart: React.FC = () => {
    const classes = useStyles();
    const data = {
        labels: [''],
        datasets: [
            {
                label: 'Tire Wear (%)',
                data: [75], // Example data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Tire Wear',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    return (
        <section className={classes.chart}>
            <Bar data={data} options={options} />
        </section>
    );
};

const useStyles = createUseStyles({
    chart: {
        width: '100%',
        height: '100%',
    },
});

export default TireWearChart;
