import { ReactNode, useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContextProvider';
import { Snackbar } from '@mui/material';

const tireNotification: string = 'Tyres broke :(';
const shifterNotification: string = 'Shifter broke :(';

const SnackBarArea: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { tireExploded, brokenShifter } = useContext(DataContext);
    const [open, setOpen] = useState<boolean>(false);
    const [text, setText] = useState<string>('');

    useEffect(() => {
        if (!tireExploded && !brokenShifter) {
            setOpen(false);
        }

        setText(tireExploded ? tireNotification : shifterNotification);
        setOpen(true);
    }, [tireExploded, brokenShifter]);

    return (
        <>
            {children}
            <Snackbar open={open} autoHideDuration={6000} message={text} />
        </>
    );
};

export default SnackBarArea;
