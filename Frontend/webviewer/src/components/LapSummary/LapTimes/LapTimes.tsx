import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import React from 'react';
import { createUseStyles } from 'react-jss';

export interface LapTime {
    sector1: number;
    sector2: number;
    sector3: number;
    total: number;
    sector1Active?: boolean;
    sector2Active?: boolean;
    sector3Active?: boolean;
}

interface LapTimesProps {
    lapTimes: LapTime[];
    fastestTimes: LapTime;
    slowestTimes: LapTime;
}

const LapTimes: React.FC<LapTimesProps> = ({
    lapTimes,
    fastestTimes,
    slowestTimes,
}) => {
    const classes = useStyles();

    return (
        <Paper
            sx={{
                filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))',
                background: 'rgb(70,70,70)',
                width: '100%',
                alignSelf: 'flex-start',
            }}
            elevation={0}
        >
            <Table size="small">
                <TableHead>
                    <TableRow
                        style={{
                            backgroundColor: 'rgb(170,170,170)',
                        }}
                    >
                        <TableCell>
                            <span className={classes.header}>#</span>
                        </TableCell>
                        <TableCell>
                            <span className={classes.header}>Sector 1</span>
                        </TableCell>
                        <TableCell>
                            <span className={classes.header}>Sector 2</span>
                        </TableCell>
                        <TableCell>
                            <span className={classes.header}>Sector 3</span>
                        </TableCell>
                        <TableCell>
                            <span className={classes.header}>Total</span>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lapTimes.map((lapTime, index) => (
                        <TableRow key={index} className={classes.row}>
                            <TableCell style={{ fontWeight: 'bold' }}>
                                {index + 1}
                            </TableCell>
                            <TableCell
                                className={[
                                    lapTime.sector1 === fastestTimes.sector1
                                        ? classes.fastest
                                        : '',
                                    lapTime.sector1 === slowestTimes.sector1
                                        ? classes.slowest
                                        : '',
                                ].join('')}
                            >
                                {lapTime.sector1}
                            </TableCell>
                            <TableCell
                                className={[
                                    lapTime.sector2 === fastestTimes.sector2
                                        ? classes.fastest
                                        : '',
                                    lapTime.sector2 === slowestTimes.sector2
                                        ? classes.slowest
                                        : '',
                                ].join(' ')}
                            >
                                {lapTime.sector2}
                            </TableCell>
                            <TableCell
                                className={[
                                    lapTime.sector3 === fastestTimes.sector3
                                        ? classes.fastest
                                        : '',
                                    lapTime.sector3 === slowestTimes.sector3
                                        ? classes.slowest
                                        : '',
                                ].join(' ')}
                            >
                                {lapTime.sector3}
                            </TableCell>
                            <TableCell
                                className={[
                                    lapTime.total === fastestTimes.total
                                        ? classes.fastest
                                        : '',
                                    lapTime.total === slowestTimes.total
                                        ? classes.slowest
                                        : '',
                                ].join(' ')}
                            >
                                {lapTime.total}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

const useStyles = createUseStyles({
    header: {
        fontWeight: 'bold',
    },
    row: {
        '&:hover': {
            filter: 'brightness(0.9)',
        },
        '&:nth-child(odd)': {
            backgroundColor: 'rgb(200,200,200)',
        },
        '&:nth-child(even)': {
            backgroundColor: 'rgb(220,220,220)',
        },
    },
    fastest: {
        backgroundColor: 'rgb(200,220,200) !important',
    },
    slowest: {
        backgroundColor: 'rgb(220,200,200) !important',
    },
});

export default LapTimes;
