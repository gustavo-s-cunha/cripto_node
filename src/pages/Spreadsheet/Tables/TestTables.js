import * as React from 'react';
import { useState } from 'react';
import BasicTable from './BasicTable';
import { Container, Paper } from '@mui/material';
import BasicTableEdit from './BasicTableEdit';

export default function TestTables() {

  return (
    <div>
      <Container component="main" maxWidth="lg" sx={{ mb: 3 }}>
        <Paper variant="" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <BasicTable />
        </Paper>
      </Container>
      <Container component="main" maxWidth="lg" sx={{ mb: 3 }}>
        <Paper variant="" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <BasicTableEdit />
        </Paper>
      </Container>

    </div>
  );
}