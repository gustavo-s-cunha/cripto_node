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

  const calcMediaPonderada = (moeda) => {
    /*
      Mp = ((p1 * x1) + (p2 * x2) + (pn * xn)) / (p1 + p2 + pn)
      
      Mp: Média aritmética ponderada
      p1, p2,..., pn: pesos
      x1, x2,...,xn: valores dos dados
    */
  };

  const calcPotencia = (x) => {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
  }

  function formatValue(value) {
    var aux_value = value;
    if (typeof value == 'string') {
      aux_value = parseFloat(value);
    }
    var aux_val = aux_value.toFixed(2);
    var aux_val_f1 = aux_val.replace('.', ',');

    return aux_val_f1;
  }

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
    setTimeout(() => {
      handleAnalises2(jsonData)
    }, 200);
  };
  const handleAnalises2 = (jsonData) => {
    //setIsLoading(true);
    //console.log(jsonData);

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
      9) ReferenceTransactionType -> tipo da transacao (Deposit - Trade)
      10) ReferenceTransactionId -> id da transacao
      11) SystemRecordReference -> alguma hash para saber qual sistema foi utilizado
      12) OMSId -> id do sistema
      13) Balance -> Saldo após o lançamento
    */
    let data_table = {};
    let arr_datas = {};
    var line;
    var moeda;
    var data;
    let fields = {};

    // agrupa os lançamentos por data
    // primeira linha é o cabeçalho
    for (var i = 1, tam = jsonData.length; i < tam; i++) {
      line = jsonData[i];
      data = dayjs(line[3]).format('DD/MM/YYYY HH:mm');
      moeda = line[6];
      var valor = parseFloat(line[7] || line[8]);

      if (!arr_datas[data]) {
        arr_datas[data] = {
          name: data,
          rows: [],
          moeda: '',
          brl: 0,
          qtd: 0,
          transacao: ''
        };
      }

      arr_datas[data].rows.push(line);
      if (/BRL.*/.test(moeda)) {
        arr_datas[data].brl += valor;
      } else {
        arr_datas[data].qtd += valor;
        arr_datas[data].moeda = moeda;
      }

      arr_datas[data].transacao += line[2] + ";";
    }

    for (var i = 1, tam = jsonData.length; i < tam; i++) {
      line = jsonData[i];
      fields = {
        id: line[1],
        data: dayjs(line[3]).format('DD/MM/YYYY HH:mm'),
        transacao: line[2],
        entrada: parseFloat(line[7] || '0'),
        saida: parseFloat(line[8] || '0'),
        val_trans: 0,
        val_medio: 0,
        tipo: '',
        balanco: parseFloat(line[13] || '0'),
      };
      moeda = line[6];

      // campos para tratamento
      if (!data_table[moeda]) {
        data_table[moeda] = {
          name: moeda,
          rows: [],
          qtd_moeda: 0,
          total_investido: 0,
          total_retorno: 0,
          val_medio: 0,
          media: [],
        };
      }

      if (fields.transacao == "Other") {
        if (line[9] == "Deposit") {
          fields.tipo = 'Deposito';
          data_table[moeda].total_investido += fields.entrada;
        } else {
          fields.tipo = 'Saque';
          data_table[moeda].total_retorno += fields.saida;
        }

        data_table[moeda].rows.push(fields);
        continue;

      } else if (fields.transacao == 'Fee') {
        fields.tipo = 'taxa'
        if (/Other/.test(arr_datas[fields.data].transacao)) {
          // taxa referente ao saque
          data_table[moeda].total_retorno += fields.entrada;

          data_table[moeda].rows.push(fields);
          continue;
        }
      } else if (fields.transacao == 'Trade') {
        // compra -> sai da minha conta para outra conta
        // credito -> debito
        if (fields.entrada > 0) {
          fields.tipo = (/BRL.*/.test(moeda) ? 'venda' : 'compra');
        } else {
          fields.tipo = (/BRL.*/.test(moeda) ? 'compra' : 'venda');
        }
      }

      // ajusta a moeda de transação
      var moeda_t = arr_datas[fields.data].moeda;

      // campos para tratamento
      if (!data_table[moeda_t]) {
        data_table[moeda_t] = {
          name: moeda_t,
          rows: [],
          qtd_moeda: 0,
          total_investido: 0,
          total_retorno: 0,
          val_medio: 0,
          media: [],
        };
      }

      // qtd_trans + taxa -> valor_trans
      // 1                -> x
      // x = valor_trans / (qtd_trans + taxa)

      //data_table[moeda_t].qtd_moeda --- data_table[moeda_t].val_medio
      //fields.entrada                --- fields.val_trans
      //(data_table[moeda_t].qtd_moeda + fields.entrada) ---> x

      fields.val_trans = arr_datas[fields.data].brl / arr_datas[fields.data].qtd;

      if (/BRL.*/.test(moeda)) {
        data_table[moeda_t].total_investido += fields.saida;
        data_table[moeda_t].total_retorno += fields.entrada;

        data_table[moeda_t].media.push([(fields.entrada || fields.saida), 'valor']);
      } else if (fields.transacao != 'Fee') {
        //valor -> (fields.saida+'').replace(/(.*)e-(.*)/, '$1')
        //potencia -> (fields.saida+'').replace(/(.*)e-(.*)/, '$2')

        if (fields.entrada > 0) {
          //aux_val_m = (data_table[moeda_t].val_medio + (fields.entrada * fields.val_trans) / (data_table[moeda_t].qtd_moeda + fields.entrada))/2;
          //aux_val_m = ((data_table[moeda_t].qtd_moeda * data_table[moeda_t].val_medio) + (fields.entrada * fields.val_trans)) / (data_table[moeda_t].qtd_moeda + fields.entrada);
          //aux_val_m = data_table[moeda_t].val_medio + aux_val_m;
          fields.val_medio = (data_table[moeda_t].val_medio + (fields.entrada * fields.val_trans)) / (data_table[moeda_t].qtd_moeda + fields.entrada);

          data_table[moeda_t].val_medio = fields.val_medio;
          data_table[moeda_t].qtd_moeda += fields.entrada;

        } else {
          //aux_val_m = (data_table[moeda_t].val_medio - (fields.saida * fields.val_trans) / (data_table[moeda_t].qtd_moeda - fields.saida))/2;
          //aux_val_m = ((data_table[moeda_t].qtd_moeda * data_table[moeda_t].val_medio) - (fields.saida * fields.val_trans)) / (data_table[moeda_t].qtd_moeda - fields.saida);
          //aux_val_m = data_table[moeda_t].val_medio - aux_val_m;
          fields.val_medio = (data_table[moeda_t].val_medio - (fields.saida * fields.val_trans)) / (data_table[moeda_t].qtd_moeda - fields.saida);

          data_table[moeda_t].val_medio = fields.val_medio;
          data_table[moeda_t].qtd_moeda -= fields.saida;
        }

        data_table[moeda_t].media.push([(fields.entrada || fields.saida), 'qtd']);
        
        data_table[moeda].rows.push(fields);

      } else { // taxa
        //var test = calcPotencia(fields.saida);
        //console.log(test);
        //aux_val_m = (data_table[moeda_t].val_medio - (fields.saida * fields.val_trans) / (data_table[moeda_t].qtd_moeda - fields.saida))/2;
        //aux_val_m = ((data_table[moeda_t].qtd_moeda * data_table[moeda_t].val_medio) - (fields.saida * fields.val_trans)) / (data_table[moeda_t].qtd_moeda - fields.saida);
        //aux_val_m = data_table[moeda_t].val_medio - aux_val_m;
        fields.val_medio = (data_table[moeda_t].val_medio - (fields.saida * data_table[moeda_t].val_medio)) / (data_table[moeda_t].qtd_moeda - fields.saida);

        data_table[moeda_t].val_medio = fields.val_medio;
        data_table[moeda_t].qtd_moeda -= fields.saida;

        data_table[moeda_t].media.push([fields.saida, 'qtd']);
        data_table[moeda_t].media.push([data_table[moeda_t].val_medio, 'valor']);
        
        data_table[moeda].rows.push(fields);
      }
      /*
      if (/BRL./.test(moeda)) {
        data_table[moeda_t].total_investido += fields.saida;
        data_table[moeda_t].total_retorno += fields.entrada;

        data_table[moeda_t].media.push([(fields.entrada || fields.saida), 'valor']);

      } else if (data_table[moeda_t].val_medio > 0) {
        if (fields.entrada > 0) {
          fields.val_medio = ((data_table[moeda_t].qtd_moeda + fields.entrada) * data_table[moeda_t].val_medio) / data_table[moeda_t].qtd_moeda;
          data_table[moeda_t].qtd_moeda += fields.entrada;
        } else {
          fields.val_medio = ((data_table[moeda_t].qtd_moeda - fields.saida) * data_table[moeda_t].val_medio) / data_table[moeda_t].qtd_moeda;
          data_table[moeda_t].qtd_moeda -= fields.saida;
        }
        data_table[moeda_t].val_medio = fields.val_medio;

        if (fields.transacao != 'Fee') {
          data_table[moeda_t].media.push([(fields.entrada || fields.saida), 'qtd']);
        }
        data_table[moeda].rows.push(fields);

      } else {
        if (fields.entrada > 0) {
          fields.val_medio = (data_table[moeda_t].val_medio + (fields.entrada * fields.val_trans)) / (data_table[moeda_t].qtd_moeda + fields.entrada);
          data_table[moeda_t].qtd_moeda += fields.entrada;

        } else {
          fields.val_medio = (data_table[moeda_t].val_medio - (fields.saida * fields.val_trans)) / (data_table[moeda_t].qtd_moeda - fields.saida);
          data_table[moeda_t].qtd_moeda -= fields.saida;
        }
        data_table[moeda_t].val_medio = fields.val_medio;

        if (fields.transacao != 'Fee') {
          data_table[moeda_t].media.push([(fields.entrada || fields.saida), 'qtd']);
        }
        data_table[moeda].rows.push(fields);
      }
       */
    }
    //console.log('---- data_table ----');
    //console.log(data_table);

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
      )}
      {isLoading ? ( <>
        <img
          src="/assets/loader.svg"
          height={100}
          style={{ marginTop: "2rem" }}
          alt="loader"
        /> 
      </>) : (<>
        {Object.keys(data).map((dat, rowIndex) => (<>
          <Divider sx={{ mt: 3, mb: 1, borderColor: green[700] }} />
          <Grid container key={dat + '_G1_' + rowIndex} sx={{ padding: 1, maxWidth: '90%' , maxHeight: '400px', overflow: 'auto' }} >
            <Grid container key={dat + '_G2_' + rowIndex} spacing={3}>
              <Grid item key={dat + '_GT0_' + rowIndex} xs={1} md={1}>
              </Grid>
              <Grid item key={dat + '_GT_' + rowIndex} xs={2} md={2}>
                <Typography key={dat + '_T_' + rowIndex} >
                  <strong>{dat}</strong>
                </Typography>
              </Grid>
              <Grid item key={dat + '_GT2_' + rowIndex} xs={4} md={4} sx={{ textAlign: "left", }}>
                <Typography key={dat + '_T2_' + rowIndex} >
                  Qtd: {data[dat].qtd_moeda}<br/>
                  Media: {formatValue(data[dat].val_medio)}
                </Typography>
              </Grid>
              <Grid item key={dat + '_GT21_' + rowIndex} xs={4} md={4} sx={{ textAlign: "left", }}>
                <Typography key={dat + '_T21_' + rowIndex} >
                  Investido: {formatValue(data[dat].total_investido)}<br/>
                  Retorno: {formatValue(data[dat].total_retorno)}
                </Typography>
              </Grid>
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
                      {dat != 'BRL' && <><TableCell align="center">Val. Transação</TableCell></>}
                      {dat != 'BRL' && <><TableCell align="center">Val. Medio</TableCell></>}
                      <TableCell align="center">Saldo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data[dat].rows).map((line, index) => (
                      <TableRow key={dat + '_tr_' + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="right">{line.tipo}</TableCell>
                        <TableCell align="right">{line.data}</TableCell>
                        <TableCell align="right">{line.entrada}</TableCell>
                        <TableCell align="right">{line.saida}</TableCell>
                        {dat != 'BRL' && <><TableCell align="right">{formatValue(line.val_trans)}</TableCell></>}
                        {dat != 'BRL' && <><TableCell align="right">{formatValue(line.val_medio)}</TableCell></>}
                        <TableCell align="right">{line.balanco}</TableCell>
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
