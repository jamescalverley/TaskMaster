import React from 'react';
import { useGlobalStore } from "../GlobalStore/GlobalStore";


function Message() {

    const [globalData] = useGlobalStore();
    //dispatch({ do: 'setMessage', type: 'danger', message: `Testing Message...` });

    return(
        <div>
            <div className={globalData.messageType ? `alert alert-${globalData.messageType}` : 'd-hide'} role="alert">
                {globalData.message}
            </div>
        </div>
    );
}

export default Message;