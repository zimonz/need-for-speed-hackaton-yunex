import React, { useState, useEffect } from 'react';

const SpeedTracker: React.FC = () => {
    const [speed, setSpeed] = useState<number>(0);

    useEffect(() => {
        const updateSpeed = () => {
            // Simulate speed update
            const newSpeed = Math.random() * 100;
            setSpeed(newSpeed);
        };

        const intervalId = setInterval(updateSpeed, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h1>Speed Tracker</h1>
            <p>Current Speed: {speed.toFixed(2)} km/h</p>
        </div>
    );
};

export default SpeedTracker;
