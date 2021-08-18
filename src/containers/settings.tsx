import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { MdSave } from 'react-icons/md';
import { useRecoilState } from 'recoil';

// components
import Layout from '../components/layout';
import PlayerForm from '../components/player/form';

// storage
import { PLAYER_KEY } from '../storage';

// state
import PersonAtom from '../state/player';

const Settings = () => {
  const [player, setPlayer] = useRecoilState(PersonAtom);
  const toast = useToast();
  const history = useHistory();

  const form = useForm<Tracker.Player>({
    mode: 'onChange'
  });
  const {
    reset,
    formState: { isSubmitting, isValid }
  } = form;

  useEffect(() => {
    if (player) {
      reset(player);
    }
  }, [player, reset]);

  return (
    <Layout
      title="Settings"
      actionComponent={
        <IconButton
          colorScheme="blue"
          aria-label="Submit"
          isLoading={isSubmitting}
          disabled={!isValid || isSubmitting}
          form="player-form"
          type="submit"
          icon={<MdSave />}
        />
      }
    >
      <Alert status="info">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Player Info</AlertTitle>
          <AlertDescription display="block">
            Don&apos;t worry, you can change these details before joining a game.
          </AlertDescription>
        </Box>
      </Alert>
      <FormProvider {...form}>
        <PlayerForm
          onSubmit={(values) => {
            const updatedPlayer: Tracker.Player = {
              peerId: player ? player.peerId : '',
              name: values.name,
              description: values.description
            };
            setPlayer(updatedPlayer);
            localStorage.setItem(PLAYER_KEY, JSON.stringify(updatedPlayer));

            toast({
              title: 'Success',
              description: 'Settings updated.',
              status: 'success',
              isClosable: true
            });

            history.push('/');
          }}
        />
      </FormProvider>
    </Layout>
  );
};

export default Settings;
