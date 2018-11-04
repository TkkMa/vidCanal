import React from 'react';
import Modal from 'react-modal';
import moment from 'moment';

const FavoriteModal = (props) => {
  const {handleCloseModal, showModal, video} = props;
  const url = `https://www.youtube.com/embed/${video.id}`;
  
  return(
    (!Object.keys(video).length) ? 
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
            <iframe width="853" height="480" src={url} frameborder="0" allowFullScreen="allowFullScreen"></iframe>
          </div>
          <div className="modal_caption">
            <div>Published on: {moment(video.snippet.publishedAt).format('DD MMM YYYY')} by  
                <a href={`http://www.youtube.com/channel/${video.snippet.channelId}`}> {video.snippet.channelTitle}</a>
                <div className="views">{video.statistics.viewCount} views</div> 
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
