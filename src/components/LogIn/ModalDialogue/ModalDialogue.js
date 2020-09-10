import React from "react";

import "./ModalDialogue.scss";

const ModalDialogue = ({messages}) => {

    return (
            <div className="modal-container">
                <form className="modal card border">

                    <div className="card-body">
                        <ul>
                            {messages && messages.map(message => <li>{message}</li>)}
                        </ul>
                    </div>
                </form>
            </div>

            )

};

export default ModalDialogue;