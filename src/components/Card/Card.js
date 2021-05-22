import React from 'react';
import '../../components-style.css';
import TextArea from '../TextArea/TextArea';
import TextAreaDesc from '../TextAreaDesc/TextAreaDesc';
import DueDate from '../DueDate/DueDate';
import AssignCard from '../AssignCard/AssignCard';

function Card(props) {
    
    return (
        <div className="card">
            <div className="card-utility-header">
                <button
                    type="button"
                    className="btn-sm btn-outline-secondary cardDelBtn"
                    onClick={() =>
                        props.deleteCard(props.colIndex, props.cardIndex)
                    }
                >
                    <i className="far fa-trash-alt"></i>
                </button>
            </div>
            <div className="card-header">
                <TextArea
                    id={'title' + props.cardid}
                    value={props.title}
                    placeholder="Title"
                />
            </div>
            <div className="card-body">
                <TextAreaDesc 
                    id={'desc' + props.cardid}
                    placeholder="Description"
                    value={props.description}
                />
                <DueDate id={'date' + props.cardid} value={props.dueDate} />
                <AssignCard
                    id={'email' + props.cardid}
                    shared={props.shared}
                    colIndex={props.colIndex}
                    cardIndex={props.cardIndex}
                    assignToCard={props.assignToCard}
                />
            </div>
        </div>
    );
}

export default Card;
