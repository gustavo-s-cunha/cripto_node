import React, { useState } from "react";
import { toast } from "react-toastify";
import { Box, Button, Container, Divider, Grid, Input, Paper, } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import dayjs from "dayjs";

import ExcelImport from "../Spreadsheet/Tables/ExcelImport";
import "./style.css";
import { green } from "@mui/material/colors";

export default function FileAnalises() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    //console.log(file);
    setSelectedFile(file);
    setData([]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    //console.log(droppedFile);
    setSelectedFile(droppedFile);
    setData([]);
  };

  const handleAnalises = (jsonData) => {
    setIsLoading(true);
    console.log(jsonData);

    /*
      0) RegisteredEntityId -> id do registro
      1) PostingEntryId -> id da postagem
      2) PostingEntryType -> tipo da postagem (Other - Trade - Fee ) - descrito em #10
      3) PostingDatetime -> data da postagem
      4) AccountId -> id da conta
      5) AccountHandle -> email responsavel pela conta
      6) Product -> produto comercializado (postado)
      7) CR -> credito recebido (entrada)
      8) DR -> debito recebido (saída)
      9) ReferenceTransactionType ->) tipo da transacao (Deposit - Trade)
      10) ReferenceTransactionId ->) id da transacao
      11) SystemRecordReference ->) alguma hash para saber qual sistema foi utilizado
      12) OMSId ->) id do sistema
    */
    let data_table = {};
    var line;
    var moeda;
    let fields = {};

    // primeira linha é o cabeçalho
    for (var i = 1, tam = jsonData.length; i < tam; i++) {
      line = jsonData[i];
      fields = {
        data: '',
        transacao: '',
        entrada: '',
        saída: '',
        valor: '',
        total: '',
        val_medio: '',
        tipo: '',
      };

      // campos para tratamento
      moeda = line[6];
      if (!data_table[moeda]) {
        data_table[moeda] = {
          name: moeda,
          rows: [],
          saldo: 0,
        };
      }

      fields['data'] = dayjs(line[3]).format('DD/MM/YYYY HH:mm');
      fields['transacao'] = line[2];

      if (fields['transacao'] == "Other") {
        if (line[9] == "Deposit") {
          fields['tipo'] = 'Deposito';
        } else { // falta testar o saque -> tem taxa?
          fields['tipo'] = 'Saque';
        }
      } else if (fields['transacao'] == 'Fee') {
        fields['tipo'] = 'taxa'
      } else if (fields['transacao'] == 'Trade') {
        // compra -> sai da minha conta para outra conta
        // credito -> debito

        if (moeda == 'BRL') {
          if (line[7] > 0) {
            fields['tipo'] = 'venda';
          } else {
            fields['tipo'] = 'compra';
          }
        } else {
          if (line[7] > 0) {
            fields['tipo'] = 'compra';
          } else {
            fields['tipo'] = 'venda';
          }
        }
      }
      fields['entrada'] = line[7];
      data_table[moeda].saldo += line[7];
      fields['saída'] = line[8];
      data_table[moeda].saldo -= line[8];

      fields['total'] = data_table[moeda].saldo;

      /* trade
        compra:
          trade 
          trade
          fee
        venda:
          trade
          fee
        */

      data_table[moeda].rows.push(fields);
    }
    console.log('---- data_table ----');
    console.log(data_table);

    toast.success("Análise concluida!");
    setTimeout(() => {
      setIsLoading(false);
      setData(data_table);
    }, 500);
  };

  const preventDefault = (event) => {
    event.preventDefault();
  };

  //<Container component="main" /*maxWidth="lg"*/ sx={{ mt: 0, maxWidth: '100%' }} id="conteiner_main">
  return ( <>
    <div className="content-wrapper bg-white">
      <Paper variant="" sx={{ my: { xs: 1, md: 1 }, p: { xs: 2, md: 1 } }} style={{ paddingTop: "16px" }} >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", }} >
          <Box sx={{ mt: 1, fontSize: "1.2rem" }}>
            <Typography variant="h4" gutterBottom>
              <strong>Análise da tabela</strong>
            </Typography>
          </Box>
          <div
            onDrop={handleDrop}
            onDragOver={preventDefault}
            className="drop-container"
            style={{
              maxWidth: '600px',
              backgroundColor: (selectedFile !== null ? "#dbffdd" : "none")
            }}
          >
            <CloudUpload sx={{ fontSize: 50, color: "#9c9c9c" }} />
            <Typography variant="body1">
              Arraste e solte um arquivo aqui ou clique para selecionar
            </Typography>
            <Button variant="contained" color="success" component="label"  onChange={handleFileChange}>
              Selecionar (CSV ou XLSX)
              <input type="file" hidden accept=".csv, .xlsx"/>
            </Button>

            <Typography variant="body1" style={{ textAlign: "center", margin: "4px 0", fontSize: "1.4rem", }} >
              <strong>. . .</strong>
            </Typography>
            <Typography variant="body1">
              {selectedFile !== null ? `Arquivo selecionado: ${selectedFile.name}` : "Nenhum arquivo selecionado."}
            </Typography>
          </div>
        </Box>
      </Paper>
      {selectedFile !== null && (
        <ExcelImport file={selectedFile} onImport={handleAnalises} />
        /*<Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleAnalises();
            }}
          >
            Analisar tabela
          </Button>
        </Box>*/
      )}
      {isLoading && (
        <img
          src="/assets/loader.svg"
          height={100}
          style={{ marginTop: "2rem" }}
          alt="loader"
        />
      )}
      {Object.keys(data).length > 0 && (<>
        {Object.keys(data).map((dat, rowIndex) => (<>
          <Divider sx={{ mt: 3, mb: 1, borderColor: green[700] }} />
          <Grid container key={dat + '_G1_' + rowIndex} xs={12} md={12} sx={{ padding: 1, maxHeight: '400px', overflow: 'auto' }} >
            <Grid item key={dat + '_G2_' + rowIndex} xs={12} md={12}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", }} >
                <Typography key={dat + '_T_' + rowIndex} variant="h5" gutterBottom>
                  <strong>{dat}</strong>
                </Typography>
              </Box>
            </Grid>
            <Grid item key={dat + '_G3_' + rowIndex} xs={1} md={1}/>
            <Grid item key={dat + '_G4_' + rowIndex} xs={10} md={10}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Tipos</TableCell>
                      <TableCell align="center">Data</TableCell>
                      <TableCell align="center">Entrada</TableCell>
                      <TableCell align="center">Saída</TableCell>
                      <TableCell align="center">Valor</TableCell>
                      <TableCell align="center">Total</TableCell>
                      <TableCell align="center">Val. Medio</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data[dat].rows).map((line, index) => (
                      <TableRow key={dat + '_tr_' + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="right">{line.tipo}</TableCell>
                        <TableCell align="right">{line.data}</TableCell>
                        <TableCell align="right">{line.entrada}</TableCell>
                        <TableCell align="right">{line.saída}</TableCell>
                        <TableCell align="right">{line.valor}</TableCell>
                        <TableCell align="right">{line.total}</TableCell>
                        <TableCell align="right">{line.val_medio}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </>))}
      </> )}
    </div>
  </>);
}
