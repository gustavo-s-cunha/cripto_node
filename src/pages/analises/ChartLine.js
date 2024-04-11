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
  let saldo_aux = 0;
  let saldo = [];
  let saldo_qtd = [];

  data.rows.map((row) => {
    if (row.tipo === "venda") {
      vendas.push((row.saida || row.entrada) * row.val_trans);
      vendas_qtd.push(row.saida);
      saldo_aux += (row.saida || row.entrada) * row.val_trans;
    } else if (row.tipo === "taxa") {
      taxas.push(((row.saida || row.entrada) * row.val_trans)*-1);
      taxas_qtd.push(row.saida || row.entrada);
      saldo_aux -= (row.saida || row.entrada) * row.val_trans;
    } else {
      compras.push(((row.saida || row.entrada) * row.val_trans)*-1);
      compras_qtd.push(row.saida || row.entrada);
      saldo_aux -= (row.saida || row.entrada) * row.val_trans;
    }
    saldo.push(saldo_aux);
    saldo_qtd.push(row.balanco);
  });

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

  var state = {
    series: [ {
      name: "Vendas",
      data: vendas,
    }, {
      name: "Vendas Qtd.",
      data: vendas_qtd,
    }, {
      name: "Taxas",
      data: taxas,
    }, {
      name: "Taxas Qtd.",
      data: taxas_qtd,
    }, {
      name: "Compras",
      data: compras,
    }, {
      name: "Compras Qtd.",
      data: compras_qtd,
    }, {
      name: "Saldo",
      data: saldo,
    }, {
      name: "Saldo Qtd.",
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
      colors: ["#29f457", "#06671c", //venda
        "#7460ee", "#5a4da5", //taxa
        "#ff2200", "#691c10", // compra
        "#414fff", "#09149f"], //saldo
      stroke: {
        width: [5, 7, 5],
        curve: "straight",
        dashArray: [0, 8, 5],
      },
      title: {
        text: "Fluxo moedas",
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
        categories: getCategoriesForMonth(),
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " R$";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val + "  R$";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
        ],
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
        Exibir Gráfico
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
            <Paper variant="" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 1 } }}>
              <ReactApexChart options={state.options} series={state.series} type="line" width={700} height={450} />
            </Paper>
          </Container>
        </Box>
      </Dialog>
    </div>
  </>)
}