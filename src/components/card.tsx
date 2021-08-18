import React from 'react';
import { Box, VStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';

interface Props {
  children: React.ReactNode;
  onDeleteClick?: () => void;
}

const Card = ({ children, onDeleteClick }: Props) => {
  const background = useColorModeValue('white', 'gray.800');

  return (
    <Box
      position={onDeleteClick ? 'relative' : undefined}
      background={background}
      borderRadius={4}
      width="100%"
      p={4}
    >
      {onDeleteClick && (
        <IconButton
          position="absolute"
          top={1}
          right={1}
          size="md"
          aria-label="Delete"
          icon={<MdDelete />}
          onClick={onDeleteClick}
          variant="ghost"
          zIndex={2}
        />
      )}
      <VStack alignItems="flex-start" width="100%">
        {children}
      </VStack>
    </Box>
  );
};

export default Card;
