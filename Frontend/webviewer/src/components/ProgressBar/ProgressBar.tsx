import { FC, useContext, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { DataContext, SectorData } from '../../contexts/DataContextProvider';

const ProgressBar: FC = () => {
    const classes = useStyles();
    const { trackPosition } = useContext(DataContext);
    const maxTrackPosition = SectorData[SectorData.length - 1].end;
    const sector1Percentage = (SectorData[0].end / maxTrackPosition) * 100;
    const sector2Percentage = (SectorData[1].end / maxTrackPosition) * 100;
    // const sector3Percentage = sector1Percentage - sector2Percentage;
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        setProgress((trackPosition / maxTrackPosition) * 100);
    }, [maxTrackPosition, trackPosition]);

    return (
        <span
            className={[classes.bar].join(' ')}
            style={{
                transition: 'all 0.1s ease',
                backgroundImage: `linear-gradient(to right, rgb(50, 220, 50) 0%, rgb(50, 220, 50) ${sector1Percentage}%, rgb(150,50,170) ${sector1Percentage}%, rgb(150,50,170) ${sector2Percentage}%, rgb(220, 220, 50) ${sector2Percentage}%, rgb(220, 220, 50) 100%)`,
            }}
        >
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
                <span
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: 'Helvetica, sans-serif',
                        color: 'white',
                        height: '100%',
                        marginLeft: 5,
                    }}
                >
                    <span>{trackPosition.toFixed(0)}</span>
                </span>
            </span>
        </span>
    );
};

const useStyles = createUseStyles({
    bar: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100vw',
        height: '5vh',
        backgroundColor: 'red',
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
