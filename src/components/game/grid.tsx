import React, { useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Text,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

interface Props {
  game: Tracker.Game;
}

const GameGrid = ({ game }: Props) => {
  const playerKeys = Object.keys(game.scores);

  return (
    <Grid width="100%" templateColumns={`repeat(${playerKeys.length}, 1fr)`} gap={4}>
      {playerKeys.map((p, column) => {
        const [expand, setExpand] = useState(false);
        const player = game.players[p];
        const scores = game.scores[p];
        const totalScore = scores.reduce((prev, current) => prev + current.points, 0);
        return (
          <>
            <GridItem
              borderBottomWidth={1}
              borderBottomStyle="solid"
              key={`player-${column}`}
              colStart={column + 1}
              rowStart={1}
              pb={4}
            >
              <HStack width="100%" alignItems="flex-start" justifyContent="space-between">
                <Box>
                  <Text>{player.name}</Text>
                  {player.description && <Text fontSize="sm">{player.description}</Text>}
                </Box>
                <IconButton
                  size="sm"
                  icon={expand ? <MdExpandLess /> : <MdExpandMore />}
                  aria-label={expand ? 'Collapse' : 'Expand'}
                  onClick={() => setExpand(!expand)}
                />
              </HStack>
            </GridItem>
            <GridItem key={`player-${column}-score`} colStart={column + 1} rowStart={2}>
              {expand ? (
                <UnorderedList>
                  {scores.map((s, i) => (
                    <ListItem key={`score-${i}`}>
                      <Text>{s.points}</Text>
                      {s.description && <Text fontSize="sm">{s.description}</Text>}
                    </ListItem>
                  ))}
                </UnorderedList>
              ) : (
                <Text textAlign="center" fontSize="xxx-large">{totalScore}</Text>
              )}
            </GridItem>
          </>
        );
      })}
    </Grid>
  );
};

export default GameGrid;
