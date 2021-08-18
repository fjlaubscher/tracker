import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import type { DataConnection } from 'peerjs';

// state
import GameAtom from '../state/game';
import GamesAtom from '../state/games';
import PlayerAtom from '../state/player';

// storage
import { GAMES_KEY } from '../storage';

import Peer from './index';

const useGame = (id: string) => {
  const toast = useToast();

  const [game, setGame] = useRecoilState(GameAtom);
  const [games, setGames] = useRecoilState(GamesAtom);
  const player = useRecoilValue(PlayerAtom);

  const [connection, setConnection] = useState<DataConnection | undefined>(undefined);

  const isHost = Peer.id === id;

  useEffect(() => {
    if (isHost) {
      Peer.on('connection', (conn) => {
        if (!connection && game) {
          conn.on('data', (data) => {
            const message = JSON.parse(data) as Tracker.Message;

            if (message.type === 'TRACKER_JOIN') {
              const newPlayer = JSON.parse(message.data) as Tracker.Player;
              toast({
                title: `${newPlayer.name} joined`,
                description: 'Get Tracking 🚀',
                status: 'success',
                isClosable: true
              });

              const updatedGame: Tracker.Game = {
                ...game,
                players: { ...game.players, [conn.peer]: newPlayer },
                scores: {
                  ...game.scores,
                  [conn.peer]: []
                }
              };

              const updateMessage: Tracker.Message = {
                type: 'TRACKER_UPDATE',
                data: JSON.stringify(updatedGame)
              };

              setGame(updatedGame);
              conn.send(JSON.stringify(updateMessage));
            } else if (message.type === 'TRACKER_UPDATE') {
              const updatedGame = JSON.parse(message.data) as Tracker.Game;
              setGame(updatedGame);
            }
          });

          conn.on('close', () => {
            if (game) {
              const updatedGames = games ? [...games, game] : [game];
              setGames(updatedGames);
              localStorage.setItem(GAMES_KEY, JSON.stringify(updatedGames));
            }
            setConnection(undefined);
          });

          setConnection(conn);
        }
      });
    } else {
      const connection = Peer.connect(id);
      // open the host connection
      connection.on('open', () => {
        const message: Tracker.Message = {
          type: 'TRACKER_JOIN',
          data: JSON.stringify(player)
        };
        connection.send(JSON.stringify(message));
      });

      // this is a "client" peer, only listen to update messages
      connection.on('data', (data) => {
        const message = JSON.parse(data) as Tracker.Message;
        if (message.type === 'TRACKER_UPDATE') {
          const updatedGame = JSON.parse(message.data) as Tracker.Game;
          setGame(updatedGame);
        }
      });

      connection.on('close', () => {
        if (game) {
          const updatedGames = games ? [...games, game] : [game];
          setGames(updatedGames);
          localStorage.setItem(GAMES_KEY, JSON.stringify(updatedGames));
        }
        setConnection(undefined);
      });

      setConnection(connection);
    }
  }, []);

  return { peer: Peer.id, connection };
};

export default useGame;
