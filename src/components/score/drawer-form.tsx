import React from 'react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useMediaQuery
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

// components
import InputField from '../../components/field/input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Tracker.Score) => void;
}

const ModelForm = ({ isOpen, onClose, onSubmit }: Props) => {
  const [isSmallDesktop] = useMediaQuery('(min-width: 1024px)');

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, errors }
  } = useForm<Tracker.Score>({
    mode: 'onChange'
  });

  return (
    <Drawer isOpen={isOpen} placement={isSmallDesktop ? 'right' : 'bottom'} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Track</DrawerHeader>
        <DrawerBody>
          <form id="score-form" onSubmit={handleSubmit(values => {
            onSubmit(values);
            reset({});
          })}>
            <InputField
              label="How many points?"
              type="number"
              placeholder="1"
              errorMessage={errors.points ? 'Required' : undefined}
              {...register('points', { required: true })}
            />
            <InputField
              label="What are the points for?"
              type="text"
              placeholder="Doing something cool"
              {...register('description', { required: false })}
            />
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={isSubmitting}
            disabled={!isValid || isSubmitting}
            form="score-form"
            type="submit"
            colorScheme="blue"
          >
            Track
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ModelForm;
