import Peer from 'peerjs';

const peer = new Peer(undefined, {
  config: {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  }
});

export default peer;
