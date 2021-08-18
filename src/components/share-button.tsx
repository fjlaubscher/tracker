import React, { useState } from 'react';
import { IconButton, useToast } from '@chakra-ui/react';
import { MdContentCopy, MdShare } from 'react-icons/md';

interface Props {
  id: string;
  name: string;
}

const ShareButton = ({ id, name }: Props) => {
  const toast = useToast();
  const [sharing, setSharing] = useState(false);

  const navigatorKeys = Object.keys(navigator);
  const canShare = navigatorKeys.includes('share');
  const canCopyToClipboard = navigatorKeys.includes('clipboard');
  const gameLink = `https://tracker.francois.codes/game/${id}`;

  return (
    <IconButton
      isLoading={sharing}
      colorScheme="blue"
      icon={canShare ? <MdShare /> : <MdContentCopy />}
      aria-label="share"
      onClick={async () => {
        setSharing(true);

        try {
          if (canShare) {
            await navigator.share({
              title: 'Tracker',
              text: `Join Tracker: ${name}`,
              url: gameLink
            });
            toast({
              title: 'Success',
              description: 'Link shared.',
              status: 'success',
              isClosable: true
            });
          } else if (canCopyToClipboard) {
            await navigator.clipboard.writeText(gameLink);
            toast({
              title: 'Success',
              description: 'Link copied.',
              status: 'success',
              isClosable: true
            });
          }
        } catch (ex) {
          toast({
            title: 'Error',
            description: ex.message,
            status: 'error',
            isClosable: true
          });
        }

        setSharing(false);
      }}
    />
  );
};

export default ShareButton;
