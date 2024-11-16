import React, { useEffect, useState } from 'react';
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

interface TireWearChartProps {
    title: string;
    dataSet: number;
    max?: number;
    neutralThreshold?: number;
    criticalThreshold?: number;
}

const BarChart: React.FC<TireWearChartProps> = ({
    title = '',
    dataSet,
    max,
    neutralThreshold = 100,
    criticalThreshold = 100,
}) => {
    const classes = useStyles();
    const [background, setBackground] = useState<string>(
        'rgba(75, 192, 192, 0.2'
    );

    const options = {
        responsive: true,
        plugins: {},
        scales: {
            y: {
                beginAtZero: true,
                max: max || 100,
            },
        },
    };

    useEffect(() => {
        if (dataSet >= criticalThreshold) {
            setBackground('rgba(255, 99, 132, 0.8)');
        } else if (dataSet >= neutralThreshold) {
            setBackground('rgba(255, 206, 86, 0.5)');
        } else {
            setBackground('rgba(75, 192, 192, 0.2)');
        }
    }, [dataSet, neutralThreshold, criticalThreshold]);

    return (
        <section className={classes.chart}>
            <Bar
                data={{
                    labels: [''],
                    datasets: [
                        {
                            label: title,
                            data: [dataSet],
                            backgroundColor: background,
                        },
                    ],
                }}
                options={options}
            />
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

export default BarChart;
