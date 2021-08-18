import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Progress, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { MdAdd } from 'react-icons/md';

// components
import GameGrid from '../components/game/grid';
import Layout from '../components/layout';
import ScoreDrawerForm from '../components/score/drawer-form';
import ShareButton from '../components/share-button';

// state
import GameAtom from '../state/game';
import PlayerAtom from '../state/player';

// webrtc
import useGame from '../webrtc/use-game';

const Game = () => {
  const { id } = useParams<IdParams>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [game, setGame] = useRecoilState(GameAtom);
  const player = useRecoilValue(PlayerAtom);

  if (!player) {
    return <Redirect to="/" />;
  }

  if (!id) {
    return <Redirect to="/not-found" />;
  }

  const { peer, connection } = useGame(id);

  return (
    <Layout
      title={game ? game.name : 'Tracker'}
      actionComponent={<ShareButton id={id} name={game ? game.name : ''} />}
    >
      {!connection && <Progress isIndeterminate />}
      {!connection && game && <Text fontSize="sm">Waiting for other players to join.</Text>}
      {connection && game && (
        <>
          <ScoreDrawerForm
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={(values) => {
              const updatedGame: Tracker.Game = {
                ...game,
                scores: {
                  ...game.scores,
                  [peer]: [
                    ...game.scores[peer],
                    { points: parseInt(values.points.toString()), description: values.description }
                  ]
                }
              };
              const message: Tracker.Message = {
                type: 'TRACKER_UPDATE',
                data: JSON.stringify(updatedGame)
              };

              if (connection) {
                connection.send(JSON.stringify(message));
              }

              setGame(updatedGame);
              onClose();
            }}
          />
          <GameGrid game={game} />
          <IconButton
            colorScheme="blue"
            size="lg"
            position="fixed"
            bottom={4}
            right={4}
            zIndex={isOpen ? -1 : 1}
            icon={<MdAdd size="2rem" />}
            aria-label="track"
            onClick={onOpen}
          />
        </>
      )}
    </Layout>
  );
};

export default Game;
