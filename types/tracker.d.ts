declare namespace Tracker {
  interface Score {
    points: number;
    description: string;
  }

  interface Player {
    peerId: string;
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
    players: Tracker.Player[];
    scores: {
      [peerId: string]: Tracker.Score[];
    }
  }
}