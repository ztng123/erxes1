import * as React from 'react';
import { __ } from '../../utils';
import { IVideoCallData } from '../types';

type Props = {
  videoCallData: IVideoCallData;
};

class VideoChatMessage extends React.PureComponent<Props> {
  joinVideoCall = () => {
    const iframeId = 'erxes-video-iframe';

    // container
    const videoChatContainer = document.createElement('div');
    videoChatContainer.id = 'erxes-video-container';

    // add iframe
    const iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.src = this.props.videoCallData.url;

    videoChatContainer.appendChild(iframe);
    const widgetRoot = document.getElementById('page-root');

    if (widgetRoot) {
      widgetRoot.appendChild(videoChatContainer);
    }
  };

  render() {
    const { videoCallData } = this.props;

    if (videoCallData.status === 'end') {
      return (
        <div className="app-message-box spaced flexible">
          <div className="user-info">
            <strong>
              <span role="img" aria-label="Phone">
                📞
              </span>{' '}
              {__('Video chat ended')}
            </strong>
          </div>
        </div>
      );
    }

    return (
      <div className="app-message-box spaced">
        <div className="user-info">
          <h4>{__('You are invited to a video chat')}</h4>
          <h2>
            <span role="img" aria-label="Wave">
              👏
            </span>
          </h2>
        </div>
        <div className="call-button">
          <button onClick={this.joinVideoCall}>{__('Join a call')}</button>
          <div className="join-call">
            ({__('or click')}{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={videoCallData.url}
            >
              {__('this link')}{' '}
            </a>
            {__('to open a new tab')})
          </div>
        </div>
      </div>
    );
  }
}

export default VideoChatMessage;
