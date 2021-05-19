import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
import './components-style.css';
import TaskMaster from './components/TaskMaster/TaskMaster';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { GlobalStore } from './components/GlobalStore/GlobalStore';

function App() {

    return (
        <Router>
            <GlobalStore>
                <Switch>
                    <Route 
                        exact path="/" 
                        component={LoginPage} 
                    />
                    <Route 
                        exact path="/login" 
                        component={LoginPage} 
                    />
                    <Route 
                        exact path="/register" 
                        component={RegisterPage} 
                    />
                    <PrivateRoute
                        exact path="/projectdashboard"
                        component={TaskMaster}
                        title={"dashboard"}
                    />
                    <PrivateRoute
                        exact path="/mytasks"
                        component={TaskMaster}
                        title={"mytasks"}
                    />
                    <PrivateRoute
                        exact path="/settings"
                        component={TaskMaster}
                        title={"settings"}
                    />
                </Switch>
            </GlobalStore>
        </Router>
    );
}

export default App;
