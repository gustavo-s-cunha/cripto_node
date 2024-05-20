import React, { useState } from "react";
import { Container, Divider, Grid, Paper, Tooltip} from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from "@mui/material";

import ExcelImport from "../Spreadsheet/Tables/ExcelImport";
import { green } from "@mui/material/colors";
import ChartLine from "./ChartLine";

export default function FileHtml({ data, obj_fn }) {
  function formatValue(value) {
    var aux_value = value;
    if (typeof value == 'string') {
      aux_value = parseFloat(value);
    }
    var aux_val = aux_value.toFixed(2);
    var aux_val_f1 = aux_val.replace('.', ',');

    return aux_val_f1;
  }

  return ( <>
    {obj_fn.selectedFile !== null && (
      <ExcelImport file={obj_fn.selectedFile} onImport={obj_fn.handleAnalises} />
    )}
    {obj_fn.isLoading ? ( <>
      <img
        src="/assets/loader.svg"
        height={100}
        style={{ marginTop: "2rem" }}
        alt="loader"
      /> 
    </>) : (<>
      {Object.keys(data).map((dat, rowIndex) => (<>
        <Divider key={dat + '_dv_' + rowIndex} sx={{ mt: 3, mb: 1, borderColor: green[700] }} />
        <Container component="main" maxWidth="sx" sx={{ mt: -3 }}>
          <Paper variant="" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 1 } }}>
            <Grid container spacing={2} key={dat + '_GC0_' + rowIndex} sx={{ padding: 2, overflow: 'auto' }} >
              <Grid container key={dat + '_GC1_' + rowIndex} spacing={3}>
                <Grid item key={dat + '_GT1_' + rowIndex} xs={12} md={2}>
                  <Typography key={dat + '_T1_' + rowIndex} >
                    <strong>{dat}</strong>
                  </Typography>
                </Grid>
                <Grid item key={dat + '_GT2_' + rowIndex} xs={12} md={5} sx={{ textAlign: "left", }}>
                  <Typography key={dat + '_T2_' + rowIndex} >
                    Qtd: {data[dat].qtd_moeda}<br/>
                    Media: {formatValue(data[dat].val_medio)}
                  </Typography>
                </Grid>
                <Grid item key={dat + '_GT3_' + rowIndex} xs={12} md={5} sx={{ textAlign: "left", }}>
                  <Typography key={dat + '_T3_' + rowIndex} >
                    <Tooltip key={dat + '_Tp3_' + rowIndex} title={<>
                      <div style={{ whiteSpace: 'pre-line' }}>
                        Investido: {formatValue(data[dat].t_investido)}<br/>
                        Taxas: {formatValue(data[dat].total_taxas)}<br/>
                        Cash-back: {formatValue(data[dat].total_cash_back)}<br/>
                        Total: {formatValue(data[dat].total_investido)}<br/>
                      </div></>}>
                      Investido: {formatValue(data[dat].total_investido)}<br/>
                    </Tooltip>
                    Retorno: {formatValue(data[dat].total_retorno)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container key={dat + '_G4_' + rowIndex} xs={12} md={12} style={{ marginTop: '8px' }}>
                <Table aria-label={dat + "-table"} size={'small'} className="table-coins">
                  <TableHead>
                    <TableRow key={dat + '_Th1_' + rowIndex}>
                      <TableCell key={dat + '_Lh1_' + rowIndex} align="center" width={60}>
                        Tipo
                      </TableCell>
                      <TableCell key={dat + '_Lh2_' + rowIndex} align="center" width={90}>
                        Data
                      </TableCell>
                      <TableCell key={dat + '_Lh3_' + rowIndex} align="center">
                        Entrada
                      </TableCell>
                      <TableCell key={dat + '_Lh4_' + rowIndex} align="center">
                        Saída
                      </TableCell>
                      {dat != 'BRL' && <>
                        <TableCell key={dat + '_Lh5_' + rowIndex} align="center">
                          Valor
                        </TableCell>
                      </>}
                      {dat != 'BRL' && <>
                        <TableCell key={dat + '_Lh6_' + rowIndex} align="center">
                          Val. Transação
                        </TableCell>
                      </>}
                      {dat != 'BRL' && <>
                        <TableCell key={dat + '_Lh7_' + rowIndex} align="center">
                          Val. Medio
                        </TableCell>
                      </>}
                      <TableCell key={dat + '_Lh8_' + rowIndex} align="center">
                        Saldo Qtd.
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
                <TableContainer component={Paper} sx={{maxHeight: '450px'}}>
                  <Table aria-label={dat + "-table2"} size={'small'} className="table-coins">
                    <TableBody>
                      {(data[dat].rows).map((line, index) => (
                        // <TableRow key={dat + '_Th2_' + index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, 
                        //   backgroundColor: index%2 == 0 ? "#FFF" : 'var(--muidocs-palette-primary-50, #EBF5FF)' }}
                        // >
                        <TableRow key={dat + '_Th2_' + index} >
                          <TableCell key={dat + '_Li1_' + rowIndex + '_' + index} align="left" width={60}>
                            {line.tipo}
                          </TableCell>
                          <TableCell key={dat + '_Li2_' + rowIndex + '_' + index} align="center" width={90}>
                            {line.data}
                          </TableCell>
                          <TableCell key={dat + '_Li3_' + rowIndex + '_' + index} align="right">
                            {line.entrada}
                          </TableCell>
                          <TableCell key={dat + '_Li4_' + rowIndex + '_' + index} align="right">
                            {line.saida}
                          </TableCell>
                          {dat != 'BRL' && <>
                            <TableCell key={dat + '_Li5_' + rowIndex + '_' + index} align="right">
                              {formatValue((line.entrada || line.saida) * line.val_trans)}
                            </TableCell>
                          </>}
                          {dat != 'BRL' && <>
                            <TableCell key={dat + '_Li6_' + rowIndex + '_' + index} align="right">
                              {formatValue(line.val_trans)}
                            </TableCell>
                          </>}
                          {dat != 'BRL' && <>
                            <TableCell key={dat + '_Li7_' + rowIndex + '_' + index} align="right">
                              {formatValue(line.val_medio)}
                            </TableCell>
                          </>}
                          <TableCell key={dat + '_Li8_' + rowIndex + '_' + index} align="right" title={"Aprox: " + line.balanco_qtd}>
                            {line.balanco}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Grid container key={dat + '_GR_' + rowIndex}>
              <ChartLine data={data[dat]} />
            </Grid>
          </Paper>
        </Container>
      </>))}
    </> )}
  </>);
}
