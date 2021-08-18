import React, { useState } from 'react';
import { Box, HStack, VStack, Text, IconButton, ListItem, UnorderedList } from '@chakra-ui/react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

interface Props {
  player: Tracker.Player;
  scores: Tracker.Score[];
}

const Score = ({ player, scores }: Props) => {
  const [expand, setExpand] = useState(false);
  const totalScore = scores.reduce((prev, current) => prev + current.points, 0);
  return (
    <VStack width="100%">
      <VStack width="100%" borderBottomWidth={1} borderBottomStyle="solid" pb={4}>
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
      </VStack>
      <VStack width="100%">
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
          <Text textAlign="center" fontSize="xxx-large">
            {totalScore}
          </Text>
        )}
      </VStack>
    </VStack>
  );
};

export default Score;
