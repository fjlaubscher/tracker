import React from 'react';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdPersonAdd } from 'react-icons/md';
import { useRecoilValue } from 'recoil';

// components
import InputField from '../field/input';

// state
import PlayerAtom from '../../state/player';

interface Props {
  onSubmit: (game: GameFormFields) => void;
}

const PlayerForm = ({ onSubmit }: Props) => {
  const player = useRecoilValue(PlayerAtom);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<GameFormFields>({ mode: 'onChange' });

  return (
    <form id="game-form" onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="What are you playing?"
        type="text"
        placeholder={`Age of Sigmar - ${player ? player.name : 'John'} vs. Sarah`}
        errorMessage={errors.name ? 'Required' : undefined}
        {...register('name', { required: true })}
      />
      <Button
        colorScheme="blue"
        isFullWidth
        disabled={!isValid}
        type="submit"
        leftIcon={<MdPersonAdd />}
      >
        Create Game
      </Button>
    </form>
  );
};

export default PlayerForm;
