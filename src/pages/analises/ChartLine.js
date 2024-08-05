import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { AppBar, Box, Button, Container, Divider, Dialog, Grid, IconButton, Paper, Slide, Typography, Toolbar, } from "@mui/material";
import { Close, MonetizationOn } from "@mui/icons-material";
import { expandAndFade } from "../../components/Loader/animationKeyFrames";
/*
 "#7460ee"
 "#5370f8"
 "#1c7dfe"
 "#0089ff"
 "#0093ff"
 "#009dff"
 "#00a5fb"
 "#00adf5"
 "#00b4ef"
 "#00bae8"
 "#00c0e1"
 "#26c6da"
*/

function getCategoriesForMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const categories = [];

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
    const formattedDate = `${dayOfWeek}. ${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}`;
    categories.push(formattedDate);
  }

  return categories;
}

function formatValue(value, str) {
  var aux_value = value
  if (typeof value == 'string') {
    aux_value = parseFloat(value)
  } else if (!value) {
    aux_value = 0
  }
  var aux_val = aux_value.toFixed(2)
  var aux_val_f1 = aux_val.replace('.', ',')

  return (str ? 'R$ ' : '') + aux_val_f1
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function ChartLine({ data }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  let taxas = [];
  let taxas_qtd = [];
  let compras = [];
  let compras_qtd = [];
  let vendas = [];
  let vendas_qtd = [];
  let saldo = [];
  let saldo_qtd = [];
  let saldo_aux = 0;

  let aux_datas_row = {};
  let datas_row = [];
  let aux_val
  
  // data.rows.map((row) => {
  //   aux_val = (row.saida || row.entrada) * row.val_trans;

  //   if (row.tipo === "venda") {
  //     vendas.push(formatValue(aux_val));
  //     vendas_qtd.push(row.saida);
  //     saldo_aux += aux_val;
  //   } else if (row.tipo === "taxa") {
  //     taxas.push(formatValue((aux_val)*-1));
  //     taxas_qtd.push(row.saida || row.entrada);
  //     saldo_aux -= aux_val;
  //   } else {
  //     compras.push(formatValue((aux_val)*-1));
  //     compras_qtd.push(row.saida || row.entrada);
  //     saldo_aux -= aux_val;
  //   }
  //   saldo.push(formatValue(saldo_aux));
  //   saldo_qtd.push(row.balanco);
  // });

  let delfault_row = {
    taxas: 0,
    taxas_qtd: 0,
    compras: 0,
    compras_qtd: 0,
    vendas: 0,
    vendas_qtd: 0,
    saldo: 0,
    saldo_qtd: 0,
  }
  saldo_aux = 0;
  data.rows.map((row) => {
    aux_val = (row.saida || row.entrada) * row.val_trans;

    let formated_date = row.data.replace(/\s.*/, '')
    if (!aux_datas_row[formated_date]) {
      aux_datas_row[formated_date] = JSON.parse(JSON.stringify(delfault_row))
      // datas_row.push(formated_date);
    }

    if (row.tipo === "venda") {
      aux_datas_row[formated_date].vendas += (aux_val);
      aux_datas_row[formated_date].vendas_qtd += (row.saida);
      saldo_aux += aux_val;
    } else if (row.tipo === "taxa") {
      aux_datas_row[formated_date].taxas += ((aux_val)*-1);
      aux_datas_row[formated_date].taxas_qtd += (row.saida || row.entrada);
      saldo_aux -= aux_val;
    } else {
      aux_datas_row[formated_date].compras += ((aux_val)*-1);
      aux_datas_row[formated_date].compras_qtd += (row.saida || row.entrada);
      saldo_aux -= aux_val;
    }
    aux_datas_row[formated_date].saldo = saldo_aux;
    aux_datas_row[formated_date].saldo_qtd = row.balanco;
    // aux_datas_row[formated_date].saldo_qtd += (row.balanco);
  });

  Object.keys(aux_datas_row).map((dat, index) => {
    vendas.push( aux_datas_row[dat].vendas.toFixed(2) );
    taxas.push( aux_datas_row[dat].taxas.toFixed(2) );
    compras.push( aux_datas_row[dat].compras.toFixed(2) );
    saldo.push( aux_datas_row[dat].saldo.toFixed(2) );

    aux_val = ((aux_datas_row[dat].vendas_qtd + '').length > 8) ? (aux_datas_row[dat].vendas_qtd).toFixed(8) : aux_datas_row[dat].vendas_qtd;
    vendas_qtd.push(aux_val);
    aux_val = ((aux_datas_row[dat].taxas_qtd + '').length > 8) ? (aux_datas_row[dat].taxas_qtd).toFixed(8) : aux_datas_row[dat].taxas_qtd;
    taxas_qtd.push(aux_val);
    aux_val = ((aux_datas_row[dat].compras_qtd + '').length > 8) ? (aux_datas_row[dat].compras_qtd).toFixed(8) : aux_datas_row[dat].compras_qtd;
    compras_qtd.push(aux_val);
    aux_val = ((aux_datas_row[dat].saldo_qtd + '').length > 8) ? (aux_datas_row[dat].saldo_qtd).toFixed(8) : aux_datas_row[dat].saldo_qtd;
    saldo_qtd.push(aux_val);

    datas_row.push(dat);
  })

  var state_value = {
    series: [ {
      name: "Vendas",
      data: vendas,
    }, {
      name: "Taxas",
      data: taxas,
    }, {
      name: "Compras",
      data: compras,
    }, {
      name: "Saldo",
      data: saldo,
    } ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#29f457", //venda
        "#7460ee", //taxa
        "#ff2200", // compra
        "#414fff"], //saldo
      stroke: {
        width: [5, 7, 5],
        curve: "straight",
        dashArray: [0, 8, 5],
      },
      title: {
        text: "Fluxo monetário",
        align: "left",
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + "";
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      yaxis: {
        labels: {
          formatter: function (y) {
            return "R$ " + (y || 0).toFixed(0);
          },
        },
      },
      xaxis: {
        type: 'category',
        categories: datas_row, //getCategoriesForMonth(),
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return formatValue(val)
          },
        },
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
    },
  };

  var state_qtd = {
    series: [ {
      name: "Vendas",
      data: vendas_qtd,
    }, {
      name: "Taxas",
      data: taxas_qtd,
    }, {
      name: "Compras",
      data: compras_qtd,
    }, {
      name: "Saldo",
      data: saldo_qtd,
    } ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#06671c", //venda
        "#5a4da5", //taxa
        "#691c10", // compra
        "#09149f"], //saldo
      stroke: {
        width: [5, 7, 5],
        curve: "straight",
        dashArray: [0, 8, 5],
      },
      title: {
        text: "Fluxo quantidade",
        align: "left",
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + "";
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      yaxis: {
        labels: {
          formatter: function (y) {
            return (y || 0);
          },
        },
      },
      xaxis: {
        type: 'category',
        categories: datas_row, //getCategoriesForMonth(),
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          },
        },
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
    },
  };
  return (<>
    <div>
      <Button sx={{ animation: `${expandAndFade} 2s linear infinite` }} variant="contained" color="success" startIcon={<MonetizationOn />} onClick={handleClickOpen}>
        Exibir Gráficos
      </Button>
      <Dialog maxWidth="xl" open={open} onClose={handleClose} TransitionComponent={Transition} >
        <AppBar sx={{ position: 'relative' }} color="inherit">
          <Toolbar>
            <Grid item container direction="row" alignItems="center" justifyContent="center" >
              <Grid item>
                <Typography variant="h6" component="div">
                  Gráfico de compras e vendas {data.name}
                </Typography>
              </Grid>
            </Grid>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Divider />
        <Box sx={{ width: '100%' }} id="focus_top_modal">
          <Container component="main" maxWidth="lg" sx={{ mt: -3 }}>
            {/* <Paper variant="" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 1 } }}>
              <ReactApexChart options={state.options} series={state.series} type="line" width={700} height={450} />
            </Paper> */}
            <Paper variant="" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 1 } }} id="chart-value">
              <ReactApexChart options={state_value.options} series={state_value.series} type="line" width={700} height={450} />
            </Paper>
            <Paper variant="" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 1 } }} id="chart-qtd">
              <ReactApexChart options={state_qtd.options} series={state_qtd.series} type="line" width={700} height={450} />
            </Paper>
          </Container>
        </Box>
      </Dialog>
    </div>
  </>)
}