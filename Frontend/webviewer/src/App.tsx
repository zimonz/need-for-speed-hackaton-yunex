import { createUseStyles } from 'react-jss';
import './App.css';
import DataContextProvider from './contexts/DataContextProvider';
import LiveView from './views/LiveView/LiveView';

function App() {
    const classes = useStyles();

    return (
        <>
            <DataContextProvider>
                <div className={classes.app}>
                    <LiveView />
                </div>
            </DataContextProvider>
        </>
    );
}

const useStyles = createUseStyles({
    app: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
    },
});

export default App;
