import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { LapTime } from '../LapTimes/LapTimes';
import { SectorData } from '../../../contexts/DataContextProvider';

interface TrackMapProps {
    laptime: LapTime;
    currentSector?: number;
    lapTimes?: LapTime[];
    trackPosition?: number;
}

const TrackMap: React.FC<TrackMapProps> = ({
    laptime,
    currentSector,
    // lapTimes = [],
    trackPosition = 0,
}) => {
    const classes = useStyles();
    const [tooltipText, setTooltipText] = React.useState('');
    const [sectorColors, setSectorColors] = React.useState({
        sector1: 'lightgray',
        sector2: 'lightgray',
        sector3: 'lightgray',
    });
    // const sector1 = useMemo(
    //     () => lapTimes.map(lapTime => lapTime.sector1),
    //     [lapTimes]
    // );
    // const sector2 = useMemo(
    //     () => lapTimes.map(lapTime => lapTime.sector2),
    //     [lapTimes]
    // );
    // const sector3 = useMemo(
    //     () => lapTimes.map(lapTime => lapTime.sector3),
    //     [lapTimes]
    // );
    const [sector1Position, setSector1Position] = useState<number | null>(null);
    const [sector2Position, setSector2Position] = useState<number | null>(null);
    const [sector3Position, setSector3Position] = useState<number | null>(null);

    // const [fastestSector1, fastestSector2, fastestSector3] = useMemo(
    //     () => [
    //         Math.min(...sector1),
    //         Math.min(...sector2),
    //         Math.min(...sector3),
    //     ],
    //     [sector1, sector2, sector3]
    // );

    useEffect(() => {
        if (
            trackPosition >= SectorData[0].start &&
            trackPosition <= SectorData[0].end
        )
            setSector1Position((trackPosition / SectorData[0].end) * 100);
        else setSector1Position(null);

        if (
            trackPosition >= SectorData[1].start &&
            trackPosition <= SectorData[1].end
        )
            setSector2Position((trackPosition / SectorData[1].end) * 100);
        else setSector2Position(null);

        if (
            trackPosition >= SectorData[2].start &&
            trackPosition <= SectorData[2].end
        )
            setSector3Position((trackPosition / SectorData[2].end) * 100);
        else setSector3Position(null);
    }, [trackPosition]);

    useEffect(() => {
        console.log(sector1Position, sector2Position, sector3Position);
    }, [sector1Position, sector2Position, sector3Position]);

    useEffect(() => {
        setSectorColors({
            sector1: 'rgb(50, 220, 50)',
            sector2: 'rgb(150,50,170)',
            sector3: 'rgb(220, 220, 50)',
        });
    }, [laptime]);

    return (
        <Tooltip title={tooltipText} followCursor>
            <svg
                width="60vw"
                height="60vh"
                viewBox="-50 -15 270 160"
                version="1.1"
                id="svg1"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs id="defs1" />
                <path
                    stroke={sectorColors.sector1}
                    strokeWidth={5}
                    strokeOpacity={1}
                    fill="transparent"
                    onMouseEnter={() =>
                        setTooltipText(
                            `Sector 1: ${
                                laptime ? laptime.sector1 + 's' : 'no time'
                            }`
                        )
                    }
                    onMouseLeave={() => setTooltipText(``)}
                    className={[
                        classes.sector1,
                        classes.sector,
                        currentSector == 1 ? classes.activeSector : '',
                    ].join(' ')}
                    d="m 10.987943,78.735657 c -0.20915,-0.50236 -0.522877,-1.08861 -0.782905,-1.60867 -0.4913177,-0.98264 -0.9486834,-1.9814 -1.4393333,-2.96333 -1.224427,-2.45043 -2.416052,-4.91677 -3.640666,-7.366 -0.457633,-0.91527 -1.154881,-1.9669 -1.367276,-2.96333 -0.08478,-0.39774 -0.146816,-0.69817 -0.196249,-1.10067 -0.06058,-0.49326 -0.0039,-1.02249 0.0718,-1.524 0.414614,-2.74853 1.879241,-5.21614 3.186433,-7.62 1.39909,-2.57285 3.0097186,-5.04726 4.6741083,-7.45067 2.980158,-4.30338 6.489989,-8.36965 9.978711,-12.27666 5.654086,-6.331995 11.40404,-12.588485 17.370386,-18.626665 3.071293,-3.10827 6.05332,-6.3069905 9.144325,-9.3979905 0.887998,-0.888 1.988153,-2.57743 3.217333,-2.93002 0.313873,-0.09 0.603064,-0.17182 0.931334,-0.18057 0.294617,-0.008 0.564477,0.0793 0.846666,0.16045 1.065232,0.3065 1.823362,1.83014 2.306645,2.7808 0.327794,0.64481 0.797362,1.56917 0.931529,2.286 0.06413,0.34261 0.121052,0.66172 0.171421,1.016 0.277922,1.9548495 -0.484575,4.0466105 -0.252754,6.0113305 0.09131,0.7739 0.160848,1.657 0.438748,2.37067 0.394741,1.01373 1.557244,1.70941 2.415744,2.35969 1.932973,1.46415 3.866829,2.97312 5.926667,4.24431"
                    id="S1_Hackenheim"
                />
                <path
                    stroke={sectorColors.sector3}
                    strokeWidth={5}
                    strokeOpacity={1}
                    fill="transparent"
                    onMouseEnter={() =>
                        setTooltipText(
                            `Sector 3: ${
                                laptime ? laptime.sector3 + 's' : 'no time'
                            }`
                        )
                    }
                    onMouseLeave={() => setTooltipText(``)}
                    className={[
                        classes.sector3,
                        classes.sector,
                        currentSector == 3 ? classes.activeSector : '',
                    ].join(' ')}
                    d="m 11.58792,79.453319 c 0.890269,2.13832 2.07567,4.193154 3.111762,6.265334 1.873442,3.74688 3.714001,7.51268 5.588001,11.26067 1.57698,3.153957 3.12037,6.326457 4.69848,9.482677 0.71499,1.42998 1.48558,2.89591 2.19663,4.318 1.55276,3.10552 3.16089,6.55549 4.85853,9.56733 0.66966,1.18806 1.2357,2.8327 2.23857,3.80634 0.36222,0.35166 0.80499,0.58408 1.26869,0.76775 0.78881,0.31244 1.68875,0.35324 2.54,0.43561 1.26361,0.12229 2.70237,0.005 3.89467,-0.41189 0.96048,-0.33622 1.84781,-1.02202 2.70933,-1.57588 1.80451,-1.16007 3.59672,-2.3374 5.334,-3.57893 1.08849,-0.77787 2.21737,-1.58717 3.12476,-2.57567 0.55016,-0.59933 0.72276,-1.16517 0.87117,-1.94733 0.21646,-1.14079 0.12302,-2.34905 -0.31293,-3.38667 -0.56007,-1.33308 -1.733,-2.46817 -2.60506,-3.64066 -2.0691,-2.78194 -4.0891,-6.55843 -7.2586,-8.14421 -1.15353,-0.577147 -2.424,-1.017662 -3.64067,-1.423142 -0.77362,-0.25782 -1.54631,-0.45687 -2.286,-0.825755 -0.61352,-0.30597 -1.35398,-0.56774 -1.85378,-1.05258 -0.37073,-0.35964 -0.60882,-0.87658 -0.8336,-1.33899 -1.15516,-2.37634 -1.6071,-5.1462 -2.21349,-7.70467 -0.37376,-1.57697 -0.91252,-3.3926 -0.75742,-4.995334 0.0433,-0.44714 0.11227,-0.84196 0.23316,-1.27 0.23623,-0.83649 0.85982,-1.57554 1.53046,-2.13751 0.93481,-0.78332 1.96885,-1.47576 3.13267,-1.85143 0.45648,-0.14734 0.89121,-0.18164 1.35467,-0.24439 0.77234,-0.10459 1.55549,0.0265 2.286,0.2325 1.04828,0.29558 1.86143,1.19605 2.50831,2.0535 1.1557,1.53187 2.31743,3.06313 3.50302,4.572004 4.29408,5.46493 8.49332,11.00261 12.94721,16.340667 1.42582,1.70887 2.83277,3.61485 4.57879,5.0116 0.61923,0.49537 1.44534,0.98975 2.20133,1.23538 2.09744,0.68147 4.09638,0.70284 6.26534,0.30829 0.91687,-0.16679 1.84642,-0.46509 2.70933,-0.83413 2.76885,-1.18413 5.26618,-3.19811 7.789337,-4.84534 7.23414,-4.722757 14.416982,-9.538607 21.50532,-14.424627 2.95433,-2.03644 6.73736,-4.771477 9.24851,-7.05694"
                    id="S3_Hackenheim"
                />
                <path
                    stroke={sectorColors.sector2}
                    strokeWidth={5}
                    strokeOpacity={1}
                    fill="transparent"
                    onMouseEnter={() =>
                        setTooltipText(
                            `Sector 2: ${
                                laptime ? laptime.sector2 + 's' : 'no time'
                            }`
                        )
                    }
                    onMouseLeave={() => setTooltipText(``)}
                    className={[
                        classes.sector2,
                        classes.sector,
                        currentSector == 2 ? classes.activeSector : '',
                    ].join(' ')}
                    d="m 65.249041,24.383789 c 0.817953,0.54125 1.842376,1.375705 2.709333,1.895865 2.011376,1.20679 4.10313,2.43809 6.180667,3.4842 2.952895,1.486875 5.919601,3.058785 8.974675,4.387695 5.70304,2.48076 11.53716,4.52278 17.525984,6.14474 4.66593,1.26368 9.65904,2.31283 14.478,2.52386 4.35398,0.19068 8.63466,-0.28191 12.954,-0.74462 9.11666,-0.97661 18.21395,-3.13025 27.00867,-5.63772 11.17175,-3.18518 22.16024,-7.058985 32.93533,-11.445405 1.61392,-0.65701 3.22325,-1.33269 4.826,-2.01658 1.42827,-0.60944 2.65604,-1.28087 4.14867,-1.4641 0.42614,-0.0523 1.46066,-0.0249 1.81923,0.35082 0.38903,0.40763 0.38363,0.97307 0.28607,1.40295 -0.34075,1.50134 -1.72369,2.11459 -2.95197,2.96117 -4.66151,3.2129 -9.42965,6.288595 -14.13933,9.428375 -7.04289,4.69526 -14.12288,9.33059 -21.16667,14.02645 -3.58129,2.38752 -7.24208,5.6149 -11.684,5.91908 -1.11752,0.0765 -2.27471,-0.11332 -3.38666,-0.23237 -1.88988,-0.20233 -3.7815,-0.40332 -5.67267,-0.5924 -5.86391,-0.58631 -11.74673,-1.22031 -17.61067,-1.80662 -2.6164,-0.26161 -5.27936,-0.76014 -7.874,-0.74763 -0.63778,0.003 -1.37175,0.0339 -1.94733,0.45966 -0.5772,0.42694 -0.8768,1.00231 -1.08558,1.65694 -0.87274,2.73654 -0.31213,5.63074 0.57758,8.29734 0.4992,1.49616 1.36373,2.90373 2.20584,4.23333 0.95072,1.5011 2.20314,2.98852 2.79459,4.65667 0.15489,0.43686 0.19701,0.90198 0.25994,1.35466 0.1454,1.04595 -8e-4,2.26247 -0.42267,3.21734 -0.55561,1.25756 -1.49947,2.24976 -2.46703,3.21733"
                    id="S2_Hackenheim"
                />
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="16.603281"
                    y="63.79657"
                    id="text290"
                >
                    <tspan
                        id="tspan288"
                        strokeWidth={5}
                        x="16.603281"
                        y="63.79657"
                    >
                        K0
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="38.59771"
                    y="8.509799"
                    id="text290-6"
                >
                    <tspan
                        id="tspan288-8"
                        strokeWidth={5}
                        x="38.59771"
                        y="8.509799"
                    >
                        K1
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="55.419502"
                    y="26.773462"
                    id="text290-6-0"
                >
                    <tspan
                        id="tspan288-8-9"
                        strokeWidth={5}
                        x="55.419502"
                        y="26.773462"
                    >
                        K2
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="194.94133"
                    y="15.739811"
                    id="text290-6-0-3"
                >
                    <tspan
                        id="tspan288-8-9-1"
                        strokeWidth={5}
                        x="194.94133"
                        y="15.739811"
                    >
                        K3
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="156.855"
                    y="65.339172"
                    id="text290-6-0-3-5"
                >
                    <tspan
                        id="tspan288-8-9-1-0"
                        strokeWidth={5}
                        x="156.855"
                        y="65.339172"
                    >
                        K4
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="108.15708"
                    y="56.401524"
                    id="text290-6-0-3-5-2"
                >
                    <tspan
                        id="tspan288-8-9-1-0-5"
                        strokeWidth={5}
                        x="108.15708"
                        y="56.401524"
                    >
                        K5
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="128.35184"
                    y="79.600609"
                    id="text290-6-0-3-5-2-1"
                >
                    <tspan
                        id="tspan288-8-9-1-0-5-7"
                        strokeWidth={5}
                        x="128.35184"
                        y="79.600609"
                    >
                        K6
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="74.176086"
                    y="101.41138"
                    id="text560"
                >
                    <tspan
                        id="tspan558"
                        strokeWidth={5}
                        x="74.176086"
                        y="101.41138"
                    >
                        K7
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="41.814171"
                    y="74.176094"
                    id="text564"
                >
                    <tspan
                        id="tspan562"
                        strokeWidth={5}
                        x="41.814171"
                        y="74.176094"
                    >
                        K8
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="45.49894"
                    y="94.682671"
                    id="text568"
                >
                    <tspan
                        id="tspan566"
                        strokeWidth={5}
                        x="45.49894"
                        y="94.682671"
                    >
                        K9
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="67.748589"
                    y="122.59825"
                    id="text568-2"
                >
                    <tspan
                        id="tspan566-8"
                        strokeWidth={5}
                        x="67.748589"
                        y="122.59825"
                    >
                        K10
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    fontSize={7}
                    fontFamily="Consolas"
                    direction={'rtl'}
                    fill="#ff0000"
                    strokeWidth={5}
                    x="27.009241"
                    y="126.25201"
                    id="text568-2-9"
                >
                    <tspan
                        id="tspan566-8-8"
                        strokeWidth={5}
                        x="27.009241"
                        y="126.25201"
                    >
                        K11
                    </tspan>
                </text>
            </svg>
        </Tooltip>
    );
};

const useStyles = createUseStyles({
    sector1: {
        '&:hover': {
            transform: 'translate(-5px, -5px)',
        },
    },
    sector2: {
        '&:hover': {
            transform: 'translate(5px, -5px)',
        },
    },
    sector3: {
        '&:hover': {
            transform: 'translate(-2px, 5px)',
        },
    },
    sector: {
        opacity: 1,
        transition: 'transform 0.2s ease-in-out',
        transitionDelay: '0.1s',
        filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))',
        '&:hover': {
            filter: 'lighten(0.82)',
        },
    },
    activeSector: {
        '-webkit-animation': 'blink 0.5s ease-in-out infinite alternate',
        animation: 'blink 0.5s ease-in-out infinite alternate',
    },
});

export default TrackMap;
