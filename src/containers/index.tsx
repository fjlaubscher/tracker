import React, { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import {
  Heading,
  IconButton,
  Grid,
  GridItem,
  VStack,
  useMediaQuery,
  Alert,
  Box,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { MdSettings } from 'react-icons/md';

// components
import Card from '../components/card';
import DeleteModal from '../components/delete-modal';
import GameCard from '../components/game/card';
import GameForm from '../components/game/form';
import Layout from '../components/layout';

// state
import GameAtom from '../state/game';
import GamesAtom from '../state/games';
import PlayerAtom from '../state/player';

// storage
import { GAMES_KEY } from '../storage';

// webrtc
import Peer from '../webrtc';

const Home = () => {
  const history = useHistory();
  const [idToDelete, setIdToDelete] = useState<string>('');

  const [games, setGames] = useRecoilState(GamesAtom);
  const player = useRecoilValue(PlayerAtom);
  const setGame = useSetRecoilState(GameAtom);

  const [isSmallDesktop] = useMediaQuery('(min-width: 1024px)');

  if (!player) {
    return <Redirect to="/settings" />;
  }

  return (
    <Layout
      title="Tracker"
      actionComponent={
        <IconButton
          colorScheme="blue"
          icon={<MdSettings />}
          as={Link}
          to="/settings"
          aria-label="Player"
        />
      }
    >
      <Heading my={4}>Hey {player.name}!</Heading>
      <Grid
        width="100%"
        templateColumns={isSmallDesktop ? '30% calc(70% - 1rem)' : '100%'}
        gap={isSmallDesktop ? 4 : 8}
      >
        <GridItem pt={isSmallDesktop ? '2rem' : 0}>
          <Alert mb={isSmallDesktop ? 4 : 8} status="info">
            <Box flex={1}>
              <AlertTitle mb={2}>Welcome to Tracker 👋</AlertTitle>
              <AlertDescription fontSize="sm" display="block">
                Tracker uses WebRTC to connect directly to other players.
                <br />
                Even though you&apos;re just keeping score, your data belongs to you.
              </AlertDescription>
            </Box>
          </Alert>
          <Card>
            <GameForm
              onSubmit={({ name }) => {
                const newGame: Tracker.Game = {
                  id: Peer.id,
                  createdDate: new Date().toISOString(),
                  name,
                  players: { [Peer.id]: player },
                  scores: { [Peer.id]: [] }
                };
                setGame(newGame);
                const gameExists = games
                  ? games.filter((g) => g.id === newGame.id).length > 0
                  : false;

                if (!gameExists) {
                  const updatedGames = games ? [...games, newGame] : [newGame];
                  setGames(updatedGames);
                  localStorage.setItem(GAMES_KEY, JSON.stringify(updatedGames));
                }

                history.push(`/game/${Peer.id}`);
              }}
            />
          </Card>
        </GridItem>
        <GridItem>
          <VStack alignItems="flex-start" width="100%">
            {games && games.length > 0 && <Heading fontSize="xl">Previous Games</Heading>}
            {games &&
              games.map((g) => (
                <GameCard
                  key={g.id}
                  game={g}
                  onDeleteClick={() => {
                    setIdToDelete(g.id);
                  }}
                />
              ))}
            )
          </VStack>
        </GridItem>
      </Grid>
      <DeleteModal
        isOpen={!!idToDelete}
        onCancelClick={() => setIdToDelete('')}
        onDeleteClick={() => {
          const filteredGames = games ? games.filter((x) => x.id !== idToDelete) : [];
          setGames(filteredGames);
          localStorage.setItem(GAMES_KEY, JSON.stringify(filteredGames));
          setIdToDelete('');
        }}
      />
    </Layout>
  );
};

export default Home;
