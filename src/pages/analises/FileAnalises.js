import React, { useState } from "react";
import { toast } from "react-toastify";
import { Box, Button, Grid, ListItem, ListItemText, Paper, Typography, } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import dayjs from "dayjs";

import DownloadButton from "../Spreadsheet/Tables/DownloadButton";
import FileHtml from "./FileHtml";

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

      Mp = (valor + ((p1 * x1) + (p2 * x2) + (pn * xn))) / (qtd + ( p1 + p2 + pn))

      Mp = (valor - ((p1 * x1) + (p2 * x2) + (pn * xn))) / (qtd - ( p1 + p2 + pn))
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

  // Custom date comparison function considering both date and time
  function compareDates(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1)
    const date2 = new Date(dateStr2)
    return date1 - date2
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
      const aux_data = jsonData.sort((a, b) => {
        return compareDates(a[3], b[3])
      });

      handleAnaliseData(aux_data);
    }, 200);
  };
  const handleAnaliseData = (jsonData) => {
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
    var data, aux_data;
    let fields = {};

    // agrupa os lançamentos por data
    // primeira linha é o cabeçalho
    for (var i = 1, tam = jsonData.length; i < tam; i++) {
      line = jsonData[i];
      aux_data = line[3].replace(/T/, ' ');
      aux_data = aux_data.replace(/Z/, '');
      data = dayjs(aux_data).format('DD/MM/YYYY HH:mm');
      moeda = line[6];
      var valor = parseFloat(line[7] || line[8]);

      if (!arr_datas[data]) {
        arr_datas[data] = {
          name: data,
          data: aux_data,
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
      aux_data = line[3].replace(/T/, ' ');
      aux_data = aux_data.replace(/Z/, '');
      fields = {
        id: line[1],
        data: dayjs(aux_data).format('DD/MM/YYYY HH:mm'),
        data_nf: aux_data,
        transacao: line[2],
        entrada: parseFloat(line[7] || '0'),
        saida: parseFloat(line[8] || '0'),
        val_trans: 0,
        val_medio: 0,
        tipo: '',
        balanco: parseFloat(line[13] || '0'),
        balanco_qtd: 0,
      };
      moeda = line[6];

      // campos para tratamento
      if (!data_table[moeda]) {
        data_table[moeda] = {
          name: moeda,
          rows: [],
          qtd_moeda: 0,
          total_investido: 0,
          t_investido: 0,
          total_taxas: 0,
          total_cash_back: 0,
          total_retorno: 0,
          val_medio: 0,
          media_pond_sup: 0,
          media_pond_inf: 0,
          media: [],
        };
      }

      if (fields.transacao == "Other") {
        if (line[9] == "Deposit") {
          fields.tipo = 'Deposito';
          data_table[moeda].total_investido += fields.entrada;
          data_table[moeda].t_investido += fields.entrada;
        } else if (line[9] == "Withdraw") {
          fields.tipo = 'Saque';
          data_table[moeda].total_retorno += fields.saida;
        } else {
          fields.tipo = 'Cash-back';
          //data_table[moeda].total_retorno += fields.entrada;
          data_table[moeda].total_investido += fields.entrada;
          data_table[moeda].total_cash_back += fields.entrada;
        }

        data_table[moeda].rows.push(fields);
        continue;

      } else if (fields.transacao == 'Fee') {
        fields.tipo = 'taxa'
        if (/Other/.test(arr_datas[fields.data].transacao)) {
          // taxa referente ao saque
          data_table[moeda].total_retorno += fields.saida;
          data_table[moeda].total_taxas += fields.saida;
          data_table[moeda].t_investido -= fields.saida;

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
          t_investido: 0,
          total_taxas: 0,
          total_cash_back: 0,
          total_retorno: 0,
          val_medio: 0,
          media_pond_sup: 0,
          media_pond_inf: 0,
          media: [],
        };
      }

      fields.val_trans = arr_datas[fields.data].brl / arr_datas[fields.data].qtd;

      //data_table[moeda_t].qtd_moeda --- data_table[moeda_t].val_medio
      //fields.entrada                --- fields.val_trans
      //(data_table[moeda_t].qtd_moeda + fields.entrada) ---> x

      if (/BRL.*/.test(moeda)) {
        data_table[moeda_t].total_investido += fields.saida;
        data_table[moeda_t].t_investido += fields.saida;
        if (fields.transacao == 'Fee') {
          data_table[moeda_t].total_taxas += fields.saida;
          data_table[moeda_t].t_investido -= fields.saida;
        }

        data_table[moeda_t].total_retorno += fields.entrada;

        data_table[moeda_t].media.push([(fields.entrada || fields.saida), 'valor']);

      } else {
        var aux_val_m = 0;
        if (fields.entrada > 0) {
          aux_val_m = (data_table[moeda_t].media_pond_sup + (fields.entrada * fields.val_trans)) / (data_table[moeda_t].media_pond_inf + fields.entrada);

          data_table[moeda_t].media_pond_sup += (fields.entrada * fields.val_trans);
          data_table[moeda_t].media_pond_inf += fields.entrada;
          data_table[moeda_t].qtd_moeda += fields.entrada;
        } else {
          aux_val_m = (data_table[moeda_t].media_pond_sup - (fields.saida * fields.val_trans)) / (data_table[moeda_t].media_pond_inf - fields.entrada);

          if (fields.tipo == 'venda' && fields.val_trans > data_table[moeda_t].val_medio) {
            aux_val_m = data_table[moeda_t].val_medio;
          } else {
            data_table[moeda_t].media_pond_sup -= (fields.saida * fields.val_trans);
            data_table[moeda_t].media_pond_inf -= fields.saida;
          }
          data_table[moeda_t].qtd_moeda -= fields.saida;
        }

        fields.val_medio = aux_val_m;
        data_table[moeda_t].val_medio = fields.val_medio;

        fields.balanco_qtd = data_table[moeda_t].qtd_moeda;
        if (fields.transacao != 'Fee') {
          data_table[moeda_t].media.push([(fields.entrada || fields.saida), 'qtd']);
        } else {
          var val_taxa = (fields.saida * fields.val_trans);
          data_table[moeda_t].total_taxas += val_taxa;
          data_table[moeda_t].t_investido -= val_taxa;
        }
        data_table[moeda].rows.push(fields);
      }
    }
    console.log('fim analise: ---------------------');
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

  const obj_fn = {
    handleAnalises: handleAnalises,
    selectedFile: selectedFile,
    isLoading: isLoading,
  };

  return ( <>
    <div className="content-wrapper bg-white">
      <Paper variant="" sx={{ my: { xs: 1, md: 1 }, p: { xs: 2, md: 1 } }} style={{ paddingTop: "16px" }} >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", }} >
          <Box sx={{ mt: 1, mb: 1, fontSize: "1.2rem" }}>
            <Typography variant="h4" gutterBottom>
              <strong>Análise da tabela de transações</strong>
            </Typography>
          </Box>
          <Grid container spacing={3} >
            <Grid item xs={1} sm={1}/>
            <Grid item xs={6} sm={6}>
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
                  {selectedFile !== null ? <>Arquivo selecionado:<br/> {selectedFile.name}</> : "Nenhum arquivo selecionado."}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={5} sm={5}>
              <Grid item xs={12} sm={12}>
                <ListItem>
                  <ListItemText 
                    primary="Relatório de transações:"
                    secondary={"Menu -> Relatórios -> Ordens executadas -> Selecione os períodos -> Download"} />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={12}>
                <ListItem>
                  <ListItemText 
                    primary="Exemplo de saída:" 
                    secondary={"Sob demanda Transaction de 2021-01-01 to 2024-08-01.csv"} />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={12}>
                <ListItem>
                  <ListItemText 
                    primary="Planilha de Exemplo:" 
                    secondary={(<>
                      <DownloadButton filename={'plan_exemple.csv'} fileUrl={'./'}/>
                    </>)} />
                </ListItem>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <FileHtml data={data} obj_fn={obj_fn} />
    </div>
  </>);
}
