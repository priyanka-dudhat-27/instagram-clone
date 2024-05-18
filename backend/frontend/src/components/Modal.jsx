/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import '../css/Modal.css'
import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const Modal = ({ setOpenModal }) => { // Destructure setOpenModal from props
    const navigate=useNavigate();
  return (
    <div className="darkBg" onClick={() => setOpenModal(false)}>
        <div className="centered">
         <div className="modal">
        <div className="modal-header">
            <h5 className='heading'>Confirm</h5>
        </div>
        <button className='closeBtn' onClick={() => setOpenModal(false)}> {/* Add onClick handler to close the modal */}
            <RiCloseLine></RiCloseLine>
        </button>
        <div className="modal-content">
            Are You Really Want to Logout?
        </div>
        <div className="modal-actions">
            <div className="action-container">
                <button className='logoutBtn' onClick={()=>{
                    setOpenModal(false);
                    localStorage.clear();
                    navigate("/signin")
                }}>Logout</button>
                <button className='cancelBtn'>Cancel</button>
            </div>
        </div>
    </div>
    </div>
    </div>
  )
}

export default Modal
