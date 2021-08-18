import React from 'react';
import {
  Box,
  Container,
  Code,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';

// components
import Layout from './components/layout';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <Layout title="Error!">
          <Alert status="error" mb="4">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Oops! Something went wrong.</AlertTitle>
              <AlertDescription display="block">Please refresh the page.</AlertDescription>
            </Box>
          </Alert>
          <Accordion width="100%" allowToggle>
            <AccordionItem width="100%">
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Click to show error details
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <strong>{this.state.error.message}</strong>
                <br />
                <Code>{this.state.error.stack}</Code>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Layout>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
