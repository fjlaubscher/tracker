import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';

// components
import Score from '../score';

interface Props {
  game: Tracker.Game;
}

const GameGrid = ({ game }: Props) => {
  const playerKeys = Object.keys(game.scores);

  return (
    <SimpleGrid width="100%" columns={playerKeys.length} gap={4}>
      {playerKeys.map((p) => (
        <Score key={`player-${p}`} player={game.players[p]} scores={game.scores[p]} />
      ))}
    </SimpleGrid>
  );
};

export default GameGrid;
