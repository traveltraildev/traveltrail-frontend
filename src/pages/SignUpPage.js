import React from 'react';
import { SignUp } from "@clerk/clerk-react";
import { Container, Paper, Box } from '@mui/material';

const SignUpPage = () => (
  <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
    <Paper sx={{ width: '100%', p: 4, borderRadius: 3, boxShadow: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <img src="/images/mainLogo.svg" alt="Trishelta Logo" style={{ height: 64 }} />
      </Box>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </Paper>
  </Container>
);

export default SignUpPage;
