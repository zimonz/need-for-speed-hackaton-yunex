import {
    Card,
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
}

interface LapTimesProps {
    lapTimes: LapTime[];
}

const LapTimes: React.FC<LapTimesProps> = ({ lapTimes }) => {
    const classes = useStyles();
    return (
        <Card
            elevation={0}
            style={{
                width: '100%',
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.header}>#</TableCell>
                        <TableCell className={classes.header}>
                            Sector 1
                        </TableCell>
                        <TableCell className={classes.header}>
                            Sector 2
                        </TableCell>
                        <TableCell className={classes.header}>
                            Sector 3
                        </TableCell>
                        <TableCell className={classes.header}>Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lapTimes.map((lapTime, index) => (
                        <TableRow key={index}>
                            <TableCell>{index}</TableCell>
                            <TableCell>{lapTime.sector1}</TableCell>
                            <TableCell>{lapTime.sector2}</TableCell>
                            <TableCell>{lapTime.sector3}</TableCell>
                            <TableCell>{lapTime.total}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

const useStyles = createUseStyles({
    header: {
        backgroundColor: 'rgb(200,200,200)',
    },
});

export default LapTimes;
