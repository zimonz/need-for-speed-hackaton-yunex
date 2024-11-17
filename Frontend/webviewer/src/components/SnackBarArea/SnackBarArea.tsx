import { ReactNode, useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContextProvider';
import { IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const tireNotification: string = 'Tyres broke :(';
const shifterNotification: string = 'Shifter broke :(';

const SnackBarArea: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { tireExploded, brokenShifter } = useContext(DataContext);
    const [open, setOpen] = useState<boolean>(false);
    const [text, setText] = useState<string>('');

    useEffect(() => {
        if (!tireExploded && !brokenShifter) {
            setOpen(false);
            return;
        }

        setText(tireExploded ? tireNotification : shifterNotification);
        setOpen(true);
    }, [tireExploded, brokenShifter]);

    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpen(false)}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );

    return (
        <>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                message={text}
                action={action}
            />
        </>
    );
};

export default SnackBarArea;
