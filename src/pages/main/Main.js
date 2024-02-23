import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";

export default function Main() {
  return (
    <div style={{ display: "flex" }}>
      <Container component="main" maxWidth="lg" sx={{ mt: 0 }}>
        <Paper variant="" sx={{ my: { xs: 1, md: 1 }, p: { xs: 2, md: 1 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src="/assets/coinext.svg"
              alt=""
              width="100"
              height="100"
            />
            <Box sx={{ mt: 3, fontSize: "1.2rem" }}>
              <Typography variant="h5" gutterBottom>
                Programa destinado à análise de dados da tabela da COINEXT
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Analisa os dados referentes ao relatório emitido de entradas e saídas de moedas
            </Typography>
            <Typography variant="h6" gutterBottom>
              Este site não armazena qualquer tipo de dados!
            </Typography>
          </Box>
          <Grid
            container
            justify="center"
            alignItems="center"
            sx={{
              mt: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link to="/analises" style={{ textDecoration: 'none' }}>
                {" "}
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Proceguir para análise
                </Button>
              </Link>
            </div>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}
