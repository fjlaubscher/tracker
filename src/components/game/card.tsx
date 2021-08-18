import React from 'react';
import { Badge, Text } from '@chakra-ui/react';

// components
import Card from '../card';

interface Props {
  game: Tracker.Game;
  onDeleteClick: () => void;
}

const GameCard = ({ game, onDeleteClick }: Props) => (
  <Card onDeleteClick={onDeleteClick}>
    <Text>{game.name}</Text>
    <Badge colorScheme="teal">{game.createdDate.substring(0, game.createdDate.indexOf('T'))}</Badge>
  </Card>
);

export default GameCard;