import Peer from 'peerjs';

const peer = new Peer(undefined, {
  host: 'francois.codes',
  port: 9000,
  path: '/',
  config: {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  }
});

export default peer;
