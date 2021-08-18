import Peer from 'peerjs';

const peer = new Peer(undefined, {
  host: '192.168.60.13',
  port: 5000,
  path: '/',
  config: {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  }
});

export default peer;
