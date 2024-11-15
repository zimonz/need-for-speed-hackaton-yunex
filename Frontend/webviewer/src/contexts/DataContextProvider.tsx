import { createContext, ReactNode, useEffect, useState } from 'react';

interface DataContextType {
    data: object;
}

export const DataContext = createContext<DataContextType | unknown>(undefined);

const DataContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [engineTemp, setEngineTemp] = useState<number[]>([]);

    useEffect(() => {
        const updateEngineTemp = () => {
            const newEngineTemp = Math.random() * 100;
            setEngineTemp([...engineTemp, newEngineTemp]);
        };

        const intervalId = setInterval(updateEngineTemp, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        console.log(engineTemp);
    }, [engineTemp]);

    return (
        <DataContext.Provider value={{ data: {} }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;
