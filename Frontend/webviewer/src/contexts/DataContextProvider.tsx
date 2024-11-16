import { createContext, ReactNode, useEffect, useState } from 'react';

export interface DataContextType {
    engineTemp: number;
    trackPosition: number;
    currentSector: number;
    tireWear: number;
    speed: number;
    gear: number;
    middlePosition: number;
    rotation: number;
    throttle: number;
    breaks: number;
    speedHistory: number[];
}

const SectorData = [
    {
        sector: 1,
        start: 0,
        end: 33,
    },
    {
        sector: 2,
        start: 34,
        end: 66,
    },
    {
        sector: 3,
        start: 67,
        end: 100,
    },
];

export const DataContext = createContext<DataContextType>(
    {} as DataContextType
);

export const MAX_HISTORY_LENGTH = 30;

const DataContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [engineTemp, setEngineTemp] = useState<number>(0);
    const [trackPosition, setTrackposition] = useState<number>(0);
    const [currentSector, setCurrentSector] = useState<number>(0);
    const [tireWear, setTireWear] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0);
    const [speedHistory, setSpeedHistory] = useState<number[]>([]);
    const [gear, setGear] = useState<number>(0);
    const [middlePosition, setMiddlePosition] = useState<number>(0);
    const [rotation, setRotation] = useState<number>(0);
    const [throttle, setThrottle] = useState<number>(0);
    const [breaks, setBreaks] = useState<number>(0);

    useEffect(() => {
        const updateData = () => {
            setEngineTemp(Math.random() * 100);
            setTrackposition(Math.random() * 100);
            setTireWear(Math.random() * 100);
            setBreaks(Math.random() * 100);
            setThrottle(Math.random() * 100);
            setSpeed(Math.random() * 200);
            setGear(Math.random() * 6);
            setMiddlePosition(
                Math.random() * 15 * (Math.random() > 0.5 ? 1 : -1)
            );
            setRotation(Math.random() * 360);
        };

        const intervalId = setInterval(updateData, 10000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const sector = SectorData.findIndex(
            sector =>
                trackPosition >= sector.start && trackPosition <= sector.end
        );
        setCurrentSector(sector > 0 ? sector + 1 : 0);
    }, [trackPosition]);

    useEffect(() => {
        setSpeedHistory(prev => {
            if (prev.length > MAX_HISTORY_LENGTH) {
                prev.shift();
            }

            return [...prev, Math.round(speed)];
        });
    }, [speed]);

    return (
        <DataContext.Provider
            value={{
                engineTemp,
                trackPosition,
                currentSector,
                tireWear,
                speed,
                gear,
                middlePosition,
                rotation,
                throttle,
                breaks,
                speedHistory,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;
