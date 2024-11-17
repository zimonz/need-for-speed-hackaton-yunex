import { createContext, ReactNode, useEffect, useState } from 'react';
import WebSocket from 'isomorphic-ws';
import { LapTime } from '../components/LapSummary/LapTimes/LapTimes';

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
    brakes: number;
    speedHistory: number[];
    steeringWheelPosition: number;
    brokenShifter: boolean;
    tireExploded: boolean;
    lastLap: number;
    laps: LapTime[];
    carFailure: boolean;
    middleAngleHistory: number[];
    middleDistanceHistory: number[];
}

export const SectorData = [
    {
        sector: 1,
        start: 0,
        end: 525,
    },
    {
        sector: 2,
        start: 526,
        end: 1350,
    },
    {
        sector: 3,
        start: 1351,
        end: 2100,
    },
];

export const DataContext = createContext<DataContextType>(
    {} as DataContextType
);

interface WorldPosition {
    X: number;
    Y: number;
    Z: number;
}

interface WorldRotation {
    X: number;
    Y: number;
    Z: number;
}

interface TrackInfo {
    DistanceToMiddle: number;
    AngleToMiddle: number;
    TrackDistance: number;
    WorldPosition: WorldPosition;
    WorldRotation: WorldRotation;
}

interface CarInfo {
    TireWear: number;
    EngineTemp: number;
    BrakeWear: number;
    BrokenShifter: boolean;
    TireExploded: boolean;
}

interface ResponseData {
    CurrentGear: number;
    CurrentBrakes: number;
    CurrentThrottle: number;
    CurrentSteeringWheel: number;
    CurrentSpeed: number;
    FastestLap: number;
    LastLap: number;
    TrackInfo: TrackInfo;
    CarInfo: CarInfo;
    UpcomingTrackInfoFollowing: { [key: string]: number };
    LatestLaptimes: LapTime[];
}

export const MAX_HISTORY_LENGTH = 100;

const DataContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [response, setResponse] = useState<ResponseData>({} as ResponseData);
    const [engineTemp, setEngineTemp] = useState<number>(0);
    const [trackPosition, setTrackPosition] = useState<number>(0);
    const [currentSector, setCurrentSector] = useState<number>(0);
    const [tireWear, setTireWear] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0);
    const [speedHistory, setSpeedHistory] = useState<number[]>([]);
    const [middleAngleHistory, setMiddleAngleHistory] = useState<number[]>([]);
    const [middleDistanceHistory, setMiddleDistanceHistory] = useState<
        number[]
    >([]);
    const [gear, setGear] = useState<number>(0);
    const [middlePosition, setMiddlePosition] = useState<number>(0);
    const [rotation, setRotation] = useState<number>(0);
    const [throttle, setThrottle] = useState<number>(0);
    const [brakes, setBrakes] = useState<number>(0);
    const [tireExploded, setTireExploded] = useState<boolean>(false);
    const [brokenShifter, setBrokenShifter] = useState<boolean>(false);
    const [carFailure, setCarFailure] = useState<boolean>(false);
    const [steeringWheelPosition, setSteeringWheelPosition] =
        useState<number>(0);
    const [lastLap, setLastLap] = useState<number>(0);
    const [laps, setLaps] = useState<LapTime[]>([]);

    useEffect(() => {
        const ws = new WebSocket(import.meta.env.VITE_WS_HOST);
        ws.onopen = () => console.log('WebSocket connected');
        ws.onclose = () => console.log('WebSocket disconnected');

        ws.onmessage = (data: MessageEvent) =>
            setResponse(JSON.parse(data.data) as ResponseData);
    }, []);

    useEffect(() => {
        if (Object.keys(response).length == 0) return;

        console.log(response);

        setEngineTemp(response.CarInfo.EngineTemp);
        setTrackPosition(response.TrackInfo.TrackDistance);
        setTireWear(response.CarInfo.TireWear);
        setBrakes(response.CurrentBrakes);
        setThrottle(response.CurrentThrottle);
        setSteeringWheelPosition(response.CurrentSteeringWheel);
        setSpeed(response.CurrentSpeed * 3.6);
        setGear(response.CurrentGear);
        setMiddlePosition(response.TrackInfo.DistanceToMiddle);
        setRotation(response.TrackInfo.AngleToMiddle);
        setBrokenShifter(response.CarInfo.BrokenShifter);
        setTireExploded(response.CarInfo.TireExploded);
        setLastLap(response.LastLap);
        setLaps(response.LatestLaptimes);
    }, [response]);

    // useEffect(
    //     () =>
    //         setLaps(prev => {
    //             console.log(laps);
    //             if (prev.length == 0) return prev;

    //             if (
    //                 laps[laps.length - 1].sector1 == null ||
    //                 laps[laps.length - 1].sector2 == null ||
    //                 laps[laps.length - 1].sector3 == null
    //             )
    //                 setCurrentLap({
    //                     sector1: laps[laps.length - 1].sector1 || 0,
    //                     sector2,
    //                     sector3,
    //                     total: null,
    //                 });

    //                 if (
    //                     laps[laps.length - 1].sector1 &&
    //                     laps[laps.length - 1].sector2 &&
    //                     laps[laps.length - 1].sector3 &&
    //                     laps[laps.length - 1].total
    //                 )
    //                     return [...prev];

    //             return prev;
    //             // return [
    //             //     ...prev,
    //             //     {
    //             //         sector1: 0,
    //             //         sector2: 0,
    //             //         sector3: 0,
    //             //         total: lastLap,
    //             //     },
    //             // ];
    //         }),
    //     [laps]
    // );

    useEffect(() => {
        setCarFailure(tireExploded || brokenShifter);
    }, [tireExploded, brokenShifter]);

    useEffect(() => {
        const sector =
            SectorData.find(
                sector =>
                    trackPosition >= sector.start && trackPosition <= sector.end
            )?.sector || 0;
        setCurrentSector(sector);
    }, [trackPosition]);

    useEffect(() => {
        setSpeedHistory(prev => {
            if (prev.length > MAX_HISTORY_LENGTH) {
                prev.shift();
            }

            return [...prev, Math.round(speed)];
        });
    }, [speed]);

    useEffect(() => {
        setMiddleDistanceHistory(prev => {
            if (prev.length > MAX_HISTORY_LENGTH) {
                prev.shift();
            }

            return [...prev, Math.round(middlePosition)];
        });
    }, [middlePosition]);

    useEffect(() => {
        setMiddleAngleHistory(prev => {
            if (prev.length > MAX_HISTORY_LENGTH) {
                prev.shift();
            }

            return [...prev, Math.round(rotation)];
        });
    }, [rotation]);

    return (
        <DataContext.Provider
            value={{
                engineTemp,
                trackPosition,
                steeringWheelPosition,
                currentSector,
                tireWear,
                speed,
                gear,
                middlePosition,
                rotation,
                throttle,
                brakes,
                speedHistory,
                brokenShifter,
                tireExploded,
                lastLap,
                carFailure,
                laps,
                middleAngleHistory,
                middleDistanceHistory,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;
