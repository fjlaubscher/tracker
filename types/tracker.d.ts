declare namespace Tracker {
  interface Score {
    points: number;
    description: string;
  }

  interface Player {
    name: string;
    description: string;
  }

  interface Message {
    type: 'TRACKER_JOIN' | 'TRACKER_UPDATE';
    data: string;
  }

  interface Game {
    id: string;
    createdDate: string;
    name: string;
    players: {
      [peerId: string]: Tracker.Player;
    };
    scores: {
      [peerId: string]: Tracker.Score[];
    }
  }
}