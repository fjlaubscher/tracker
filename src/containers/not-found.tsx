import React from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';

// components
import Layout from '../components/layout';

const NotFound = () => (
  <Layout title="Not Found!">
    <Alert status="warning">
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>Not Found!</AlertTitle>
        <AlertDescription display="block">
          The page you were looking for does not exist.
        </AlertDescription>
      </Box>
    </Alert>
  </Layout>
);

export default NotFound;
