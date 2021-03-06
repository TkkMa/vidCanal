import React from 'react';
import Modal from 'react-modal';

const DeletionModal = (props) => {
  const {handleCloseModal, showModal, message} = props;
  
  return(
        <Modal
          isOpen={showModal}
          onRequestClose={handleCloseModal}
          contentLabel="Deletion History Items Modal"
          closeTimeoutMS={200}
          className="modal-2"
        >
          <div className="modal_caption">
            <div>
                Are you sure you would like to clear {message}?
            </div>
            <div>
                <button className="waves-effect waves-light btn-small" onClick={props.clearList}>Yes</button>
                <button className="waves-effect waves-light btn-small" onClick={props.handleCloseModal}>Cancel</button>
            </div>
          </div>
        </Modal>
    );
}

export default DeletionModal;