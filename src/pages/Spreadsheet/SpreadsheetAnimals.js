import React, { useState, useEffect } from 'react';
import Spreadsheet from 'react-spreadsheet';


{/* <Container component="main" maxWidth="lg" sx={{ mb: 3 }}>
<Paper variant="" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
  <SpreadsheetBasic />
</Paper>
</Container> */}

/* COLUNAS
1: Fase de manejo
2: Sexo
3: Brinco
4: Nome
5: Raça
6: Peso
7: Unidade Peso
8: Data Nascimento
*/

export default function SpreadsheetAnimals({ lista, handleChange, listaP, view, handletableClick }) {
  var default_values = [ { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' } ];
  const columnLabels = [ "Fase", "Sexo", "Identificador", "Brinco", "SISBOV", "Nome", "Raça", "Peso", "Un. Peso", "Data Nascimento" ];

  const [data, setData] = useState(!lista?.length ? [default_values] : lista);
  const [dataP, setDataP] = useState(!listaP?.length ? [default_values] : listaP);
  const [headers, setHeaders] = useState([]);

  const handleImport = (jsonData) => {
    const importedData = jsonData.map((row) =>
      row.map((cell) => ({ value: cell }))
    );
    const importedHeaders = importedData[0].map((cell) => cell.value);
    setHeaders(importedHeaders);
    setData(importedData);
  };

  const handleChangeSheet = (dataSheet) => {
    if (!view) {
      setData(dataSheet);
      handleChange(dataSheet);
    }
  };

  const handleClickSheet = (data, e) => {
    console.log('data');
    if (data && data[0]?.column == 7) {
      //campo de peso
      handletableClick(data[0].row, 'peso');

    } else if (data && data[0]?.column == 9) {
      //data de nascimento dos animais
      handletableClick(data[0].row, 'data');
    }
  };

  useEffect(() => {
    if (view) {
      setDataP(!listaP?.length ? [default_values] : listaP);
    } else {
      setData(!lista?.length ? [default_values] : lista);
    }
  }, [lista, listaP]);

  /* Classes adicionadas à tabela
    Nativas: 
    header: Spreadsheet__header
    celula: Spreadsheet__cell
    Adicionadas: 
    tabela: spreadSheetTable
    celula: classRowTable
    celula: classRowTableDisabled
  */
  return (
    <div>
      {view ?
      <Spreadsheet data={dataP} columnLabels={columnLabels} className='spreadSheetTable'/>
      :
      <Spreadsheet data={data} onSelect={handleClickSheet} onChange={handleChangeSheet} columnLabels={columnLabels} className='spreadSheetTable'/>
      }
    </div>
  );
}