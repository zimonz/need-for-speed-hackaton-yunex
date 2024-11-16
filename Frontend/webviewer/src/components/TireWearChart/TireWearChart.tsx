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
    labels: string[];
    dataSet: number | number[];
    max?: number;
    neutralThreshold?: number;
    criticalThreshold?: number;
}

const BarChart: React.FC<TireWearChartProps> = ({
    labels,
    title = '',
    dataSet,
    max,
    neutralThreshold = 100,
    criticalThreshold = 100,
}) => {
    const classes = useStyles();
    const [background, setBackground] = useState<string[]>([
        'rgba(75, 192, 192, 0.2',
    ]);

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
        const backgrounds: string[] = [];
        const data = Array.isArray(dataSet) ? dataSet : [dataSet];

        data.forEach(value => {
            if (value >= criticalThreshold) {
                backgrounds.push('rgba(255, 99, 132, 0.8)');
            } else if (value >= neutralThreshold) {
                backgrounds.push('rgba(255, 206, 86, 0.5)');
            } else {
                backgrounds.push('rgba(75, 192, 192, 0.2)');
            }
        });

        setBackground(backgrounds);
    }, [dataSet, neutralThreshold, criticalThreshold]);

    return (
        <section className={classes.chart}>
            <Bar
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: title,
                            data: Array.isArray(dataSet) ? dataSet : [dataSet],
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
