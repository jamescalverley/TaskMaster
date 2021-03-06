import React, { useState, useRef } from 'react';
import SharedDashboard from '../SharedDashboard/SharedDashboard';

function SharedDashboardInfoPanel(props) {
    const sharedDashboards = props.sharedDashboards;
    const [show, setShow] = useState(false);
    const select = useRef(null);

    function showDashboard() {
        select.current.value !== '' ? setShow(true) : setShow(false);
    }
    return (
        <div>
            Shared Dahsboards<br></br>
            You have {sharedDashboards.length} dashboards shared with you!
            <br></br>
            <select ref={select} onChange={showDashboard}>
                <option></option>
                {sharedDashboards.map((element) => {
                    return <option>{element.email}</option>;
                })}
            </select>
            <hr></hr>
            <div>
                {
                    <SharedDashboard
                        toRender={sharedDashboards[0]}
                        render={show}
                    />
                }
            </div>
        </div>
    );
}

export default SharedDashboardInfoPanel;
