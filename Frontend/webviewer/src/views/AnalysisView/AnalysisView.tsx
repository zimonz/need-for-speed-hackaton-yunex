import React from 'react';
import { createUseStyles } from 'react-jss';
import LapSummary from '../../components/LapSummary/LapSummary';
import ProgressBar from '../../components/ProgressBar/ProgressBar';

const AnalysisView: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.layout}>
            <LapSummary />
            <ProgressBar />
        </div>
    );
};

const useStyles = createUseStyles({
    layout: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgb(50,50,50)',
    },
});

export default AnalysisView;
