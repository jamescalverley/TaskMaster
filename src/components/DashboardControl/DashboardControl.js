import React, { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

function DashboardControl(props) {
    const dashboards = props.dashboards;
    const dashboardName = useRef('');
    //const dashboardIndex = useRef(null);
    const user = props.user;
    const currentDashboard = props.currentDashboard;
    
    return (
        <>
            <div className="dash-control-container">
                <div className="dash-nav-add">
                    <div className="input-group mb-3 dashAddInput">
                        <input
                            type="text"
                            className="form-control form-control-sm dash-input"
                            placeholder="new dashboard"
                            aria-label="dashboard add"
                            aria-describedby="dashboard add"
                            ref={dashboardName}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-sm btn-secondary"
                                type="button"
                                onClick={() => {
                                    if (dashboardName.current.value !== '') {
                                        props.addDashboard(
                                            dashboardName.current.value
                                        );
                                    } else {
                                        alert('Please add dashboard name');
                                    }
                                    console.log(dashboardName.current.value);
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button 
                            type="button" 
                            className="btn btn-success dropdown-toggle" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false"
                        >
                        {user.dashboards[currentDashboard].name}
                        </button>
                        <div className="dropdown-menu">
                            {dashboards.map((dash, index) => {
                                return (
                                    <div key={uuidv4()}>
                                        <a
                                            value={index}
                                            data-index={index}
                                            href="/"
                                            onClick={(e) =>
                                                props.switchDashboard(
                                                    e.target.dataset.index
                                                )
                                            }
                                        >
                                            {dash.name}-{dash.owner}
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default DashboardControl;
