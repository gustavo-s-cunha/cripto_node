import React, { useState } from "react";
import { Box, Button, Container, Grid, Input, LinearProgress, Paper, Typography, } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import "./style.css";

export default function FileAnalises() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(""); // Novo estado para o nome do arquivo
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    setSelectedFile(file);
    setSelectedFileName(file ? file.name : ""); // Define o nome do arquivo no estado
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    console.log(droppedFile);
    setSelectedFile(droppedFile);
    setSelectedFileName(droppedFile ? droppedFile.name : ""); // Define o nome do arquivo no estado
  };

  const handleAnalises = async () => {
    if (!selectedFile) {
      console.error("Nenhum arquivo selecionado.");
      toast.error(`Selecione um arquivo válido`);
      return;
    }
    console.log(selectedFile);

    /*

    if (csv) {
      analize do arquivo
    
    } else if (excel) {
      analize do arquivo

    } else {
      toast.error(`Arquivo inválido. Me ajude a te ajudar`);
      return false;
    }
    */

   toast.success("Análise concluida!");
   setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  const preventDefault = (event) => {
    event.preventDefault();
  };

  return ( <>
    <Container component="main" maxWidth="sm" sx={{ mt: 0 }}>
      <Paper variant="" sx={{ my: { xs: 1, md: 1 }, p: { xs: 2, md: 1 } }} style={{ paddingTop: "16px" }} >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", }} >
          <Box sx={{ mt: 3, mb: 3, fontSize: "1.2rem" }}>
            <Typography variant="h4" gutterBottom>
              <strong>Análise da tabela</strong>
            </Typography>
          </Box>
        </Box>
        <div
          onDrop={handleDrop}
          onDragOver={preventDefault}
          className="drop-container"
          style={
            selectedFile !== null
              ? { backgroundColor: "#dbffdd" }
              : { backgroundColor: "none" }
          }
        >
          <CloudUploadIcon sx={{ fontSize: 80, color: "#9c9c9c" }} />
          <Typography variant="body1">
            {selectedFileName
              ? `Arquivo selecionado: ${selectedFileName}`
              : "Arraste e solte um arquivo aqui ou clique para selecionar."}
          </Typography>
          <Typography
            variant="body1"
            style={{
              textAlign: "center",
              margin: "4px 0",
              fontSize: "1.4rem",
            }}
          >
            <strong>. . .</strong>
          </Typography>
          <Input
            type="file"
            inputProps={{ accept: ".csv" }}
            onChange={handleFileChange}
          />
        </div>
      </Paper>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            handleAnalises();
            setIsLoading(true);
          }}
        >
          Analisar tabela
        </Button>
      </Box>
      {isLoading && selectedFile !== null && (
        <img
          src="/assets/loader.svg"
          height={100}
          style={{ marginTop: "2rem" }}
          alt="loader"
        />
      )}
      {/*<>
        CONTEÚDO DA ANÁLISE
      </>*/}
    </Container>
  </>);
}
