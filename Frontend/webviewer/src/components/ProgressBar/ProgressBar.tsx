import { FC, useContext, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { DataContext, SectorData } from '../../contexts/DataContextProvider';

const ProgressBar: FC = () => {
    const classes = useStyles();
    const { trackPosition } = useContext(DataContext);
    const maxTrackPosition = SectorData[SectorData.length - 1].end;
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        setProgress((trackPosition / maxTrackPosition) * 100);
    }, [maxTrackPosition, trackPosition]);

    return (
        <span className={[classes.bar].join(' ')}>
            <span
                className={classes.progress}
                style={{
                    width: `${100 - progress}%`,
                }}
            >
                <img
                    src="/assets/img/f1-car.svg"
                    height={'100%'}
                    className={classes.mirror}
                    style={{ marginLeft: 10 }}
                />
            </span>
        </span>
    );
};

const useStyles = createUseStyles({
    bar: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100vw',
        height: '5vh',
        backgroundColor: 'red',
        backgroundImage: 'linear-gradient(to right, tomato , #2f2);',
    },
    progress: {
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        background: 'rgb(50,50,50)',
    },
    mirror: {
        transform: 'scale(-1,1)',
    },
});

export default ProgressBar;
