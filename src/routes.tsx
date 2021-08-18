import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Progress } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';

// containers
const Game = lazy(() => import('./containers/game'));
const Home = lazy(() => import('./containers'));
const NotFound = lazy(() => import('./containers/not-found'));
const Settings = lazy(() => import('./containers/settings'));

// state
import GamesAtom from './state/games';
import PlayerAtom from './state/player';

// storage
import { GAMES_KEY, PLAYER_KEY } from './storage';

// webrtc
import Peer from './webrtc';

const Routes = () => {
  const [games, setGames] = useRecoilState(GamesAtom);
  const [player, setPlayer] = useRecoilState(PlayerAtom);

  useEffect(() => {
    if (!player) {
      Peer.on('open', () => {
        const storedPlayer = localStorage.getItem(PLAYER_KEY);
        if (storedPlayer) {
          const player = JSON.parse(storedPlayer) as Tracker.Player;
          setPlayer(player);
        } else {
          const newPlayer: Tracker.Player = {
            name: 'New Player',
            description: 'Tracker of Points'
          };
          setPlayer(newPlayer);
          localStorage.setItem(PLAYER_KEY, JSON.stringify(newPlayer));
        }
      });
    }

    if (!games) {
      const storedGames = localStorage.getItem(GAMES_KEY);
      if (storedGames) {
        const parsedGames: Tracker.Game[] = storedGames ? JSON.parse(storedGames) : [];
        setGames(parsedGames);
      }
    }
  }, [player, setPlayer, games, setGames]);

  return player ? (
    <Suspense fallback={<Progress isIndeterminate />}>
      <Switch>
        <Route path="/settings" exact component={Settings} />
        <Route path="/game/:id" exact component={Game} />
        <Route path="/" exact component={Home} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  ) : (
    <Progress isIndeterminate />
  );
};

export default Routes;
