import React from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import {videoDetailObj} from '../fixtures/vidFieldNorm';

const FavoriteModal = (props) => {
  const {handleCloseModal, showModal} = props;
  const video = videoDetailObj(props.video);

  return(
    (!video) ? 
      (<div></div>):
      (
        <Modal
          isOpen={showModal}
          onRequestClose={handleCloseModal}
          contentLabel="Testing Modal"
          closeTimeoutMS={200}
          className="modal-1"
        >
          <div className="video-container">
            <iframe width="853" height="480" src={video.embedURL} frameborder="0" allowFullScreen="allowFullScreen"></iframe>
          </div>
          <div className="modal_caption">
            <div>Published on: {moment(video.publishedAt).format('DD MMM YYYY')} by  
                <a href={video.channelUrl}> {video.channelTitle}</a>
                <div className="views">{video.viewCount} views</div> 
            </div>
            <div>
                <button className="btn-flat waves-effect waves-light btn-small" onClick={props.handleCloseModal}>Close</button>
            </div>
          </div>
        </Modal>
      )
  );
}

export default FavoriteModal;
