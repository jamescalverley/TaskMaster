import React, { useState } from 'react';

function InviteCard(props){
    
    //const sharedDashboards = props.sharedByUser ? props.sharedByUser : [];

    const [email, setEmail] = useState('');
    function handleInputChange(e) {
        setEmail(e.target.value);
    };

    return (
        <div className="invite-form-container">
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control form-control-sm invite-input" 
                    placeholder="email" 
                    aria-label="invite email" 
                    aria-describedby="invite email"
                    value={email}
                    onChange={handleInputChange}
                />
                <div className="input-group-append">
                    <button 
                        className="btn btn-sm btn-secondary" 
                        type="button"
                        onClick={() => {
                            props.inviteUser(email);
                            setEmail('');
                        }}
                    >
                    Invite
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteCard;
