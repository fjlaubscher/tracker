import React, { useState, useEffect } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { Box, Button, Progress, UnorderedList, ListItem, Text, useToast } from '@chakra-ui/react';
import { useRecoilValue, useRecoilState } from 'recoil';
import type { DataConnection } from 'peerjs';

// components
import Layout from '../components/layout';
import ShareButton from '../components/share-button';

// state
import GameAtom from '../state/game';
import PlayerAtom from '../state/player';

// webrtc
import Peer from '../webrtc';

const Game = () => {
  const history = useHistory();
  const toast = useToast();
  const { id } = useParams<IdParams>();

  const [game, setGame] = useRecoilState(GameAtom);
  const player = useRecoilValue(PlayerAtom);

  const [hostConnection, setHostConnection] = useState<DataConnection | undefined>(undefined);
  const [clientConnections, setClientConnections] = useState<DataConnection[]>([]);
  const [connected, setConnected] = useState(false);

  if (!player) {
    return <Redirect to="/" />;
  }

  if (!id) {
    return <Redirect to="/not-found" />;
  }

  const isHost = player.peerId === id;

  useEffect(() => {
    if (isHost) {
      if (!connected) {
        // this is the "host" peer, listen for connections
        Peer.on('connection', (connection) => {
          const hasConnection =
            clientConnections.filter((c) => c.peer === connection.peer).length > 0;

          if (!hasConnection) {
            connection.on('data', (data) => {
              const message = JSON.parse(data) as Tracker.Message;

              if (message.type === 'TRACKER_JOIN' && game) {
                const newPlayer = JSON.parse(message.data) as Tracker.Player;
                const updatedGame: Tracker.Game = {
                  ...game,
                  players: [...game.players, newPlayer],
                  scores: {
                    ...game.scores,
                    [newPlayer.peerId]: []
                  }
                };
                setGame(updatedGame);

                // send to everyone but this connection
                const updateMessage: Tracker.Message = {
                  type: 'TRACKER_UPDATE',
                  data: JSON.stringify(game)
                };
                [...clientConnections, connection].forEach((c) =>
                  c.send(JSON.stringify(updateMessage))
                );
              } else if (message.type === 'TRACKER_UPDATE') {
                const updatedGame = JSON.parse(message.data) as Tracker.Game;
                setGame(updatedGame);

                // send to everyone but this connection
                const updateMessage: Tracker.Message = {
                  type: 'TRACKER_UPDATE',
                  data: JSON.stringify(game)
                };
                clientConnections
                  .filter((c) => c.peer !== connection.peer)
                  .forEach((c) => c.send(JSON.stringify(updateMessage)));
              }
            });

            // keep track of all client connections to send updates to later
            setClientConnections([...clientConnections, connection]);
            setConnected(true);
          }
        });
      }
    } else {
      if (hostConnection) {
        if (!connected) {
          // open the host connection
          hostConnection.on('open', () => {
            const message: Tracker.Message = {
              type: 'TRACKER_JOIN',
              data: JSON.stringify(player)
            };
            hostConnection.send(JSON.stringify(message));
          });

          // this is a "client" peer, only listen to update messages
          hostConnection.on('data', (data) => {
            const message = JSON.parse(data) as Tracker.Message;
            if (message.type === 'TRACKER_UPDATE') {
              const updatedGame = JSON.parse(message.data) as Tracker.Game;
              setGame(updatedGame);
            }
          });
          setConnected(true);
        }
      } else {
        // connect to host and request update
        setHostConnection(Peer.connect(id));
      }
    }
  }, [
    game,
    setGame,
    Peer,
    hostConnection,
    setHostConnection,
    connected,
    setConnected,
    clientConnections,
    setClientConnections
  ]);

  return (
    <Layout title="Game" actionComponent={<ShareButton id={id} name={game ? game.name : ''} />}>
      {!connected && <Progress isIndeterminate />}
      {!connected && game && clientConnections.length === 0 && (
        <Text fontSize="sm">Waiting for other players to join.</Text>
      )}
      {connected && game && (
        <>
          {game.players.map((p) => {
            const peerId = p.peerId;
            if (peerId) {
              const scores = game.scores[peerId];
              return (
                <Box key={`player-${peerId}`}>
                  <Text fontSize="sm">{p.name}</Text>
                  {p.description && <Text fontSize="xs">{p.description}</Text>}
                  <UnorderedList>
                    {scores &&
                      scores.map((s, i) => <ListItem key={`score-${i}`}>{s.points}</ListItem>)}
                  </UnorderedList>
                </Box>
              );
            }

            return undefined;
          })}
          <Button
            onClick={() => {
              const newScore: Tracker.Score = {
                points: 1,
                description: 'button press'
              };
              const updatedGame: Tracker.Game = {
                ...game,
                scores: {
                  ...game.scores,
                  [player.peerId]: [...game.scores[player.peerId], newScore]
                }
              };
              const message: Tracker.Message = {
                type: 'TRACKER_UPDATE',
                data: JSON.stringify(updatedGame)
              };

              if (isHost) {
                // send to everyone but this connection
                clientConnections.forEach((c) => c.send(JSON.stringify(message)));
              } else if (!isHost && hostConnection) {
                hostConnection.send(JSON.stringify(message));
              }

              setGame(updatedGame);
            }}
          >
            Update Score
          </Button>
        </>
      )}
    </Layout>
  );
};

export default Game;
