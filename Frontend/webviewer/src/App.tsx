import { createUseStyles } from 'react-jss';
import './App.css';
import DataContextProvider from './contexts/DataContextProvider';
import LiveView from './views/LiveView/LiveView';
import AnalysisView from './views/AnalysisView/AnalysisView';
import SnackBarArea from './components/SnackBarArea/SnackBarArea';

function App() {
    const classes = useStyles();

    return (
        <>
            <DataContextProvider>
                <SnackBarArea>
                    <div className={classes.app}>
                        <div className={classes.page}>
                            <LiveView />
                        </div>
                        <div className={classes.page}>
                            <AnalysisView />
                        </div>
                    </div>
                </SnackBarArea>
            </DataContextProvider>
        </>
    );
}

const useStyles = createUseStyles({
    app: {
        display: 'block',
        minWidth: '1300px',
        width: '100vw',
        backgroundColor: '#efefef',
    },
    pages: {
        display: 'flex',
        flexDirection: 'column',
    },
    page: {
        height: '100vh',
        width: '100vw',
    },
    middle: {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
        left: 0,
        bottom: 0,
    },
});

export default App;
