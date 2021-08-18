import React from 'react';
import { SimpleGrid, useMediaQuery } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

// components
import InputField from '../field/input';

interface Props {
  onSubmit: (values: Tracker.Player) => void;
}

const PlayerForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useFormContext<Tracker.Player>();
  const [isSmallDesktop] = useMediaQuery('(min-width: 1024px)');

  return (
    <form id="player-form" onSubmit={handleSubmit(onSubmit)}>
      <SimpleGrid spacing={isSmallDesktop ? 2 : undefined} columns={isSmallDesktop ? 2 : 1}>
        <InputField
          label="Name"
          type="text"
          placeholder="Your name"
          errorMessage={errors.name ? 'Required' : undefined}
          {...register('name', { required: true })}
        />
        <InputField
          label="Description"
          type="text"
          placeholder="Your title or faction name"
          errorMessage={errors.description ? 'Required' : undefined}
          {...register('description', { required: true })}
        />
      </SimpleGrid>
    </form>
  );
};

export default PlayerForm;