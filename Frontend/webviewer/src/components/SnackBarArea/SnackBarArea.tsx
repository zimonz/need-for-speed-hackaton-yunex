import { ReactNode, useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContextProvider';
import { Snackbar } from '@mui/material';

const tireNotification: string =
    'It is with great regret that I inform you that the tyres have exploded. :(';
const shifterNotification: string = 'Sadly, shifter broke :(';

const SnackBarArea: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { tireExploded, brokenShifter } = useContext(DataContext);
    const [open, setOpen] = useState<boolean>(false);
    const [text, setText] = useState<string>('');

    useEffect(() => {
        if (!tireExploded && !brokenShifter) return;

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
