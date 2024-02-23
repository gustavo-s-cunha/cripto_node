import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import Spreadsheet from 'react-spreadsheet';
import ExcelImport from './ExcelImport';
import ExcelExportSpreadsheet from './ExcelExportSpreadsheet';


{/* <Container component="main" maxWidth="lg" sx={{ mb: 3 }}>
<Paper variant="" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
  <SpreadsheetBasic />
</Paper>
</Container> */}

const SpreadsheetBasic = () => {
  const [data, setData] = useState([
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
  ]);
  const [headers, setHeaders] = useState([]);

  const handleImport = (jsonData) => {
    const importedData = jsonData.map((row) =>
      row.map((cell) => ({ value: cell }))
    );
    const importedHeaders = importedData[0].map((cell) => cell.value);
    setHeaders(importedHeaders);
    setData(importedData);
  };

  const addRow = () => {
    const newRow = Array(data[0].length).fill({ value: '' });
    setData((prevData) => [...prevData, newRow]);
  };

  const addColumn = () => {
    const newColumn = { value: '' };
    setData((prevData) => prevData.map((row) => [...row, newColumn]));
  };

  const deleteRow = (index) => {
    setData((prevData) => prevData.filter((_, rowIndex) => rowIndex !== index));
  };

  const deleteColumn = (index) => {
    setData((prevData) => prevData.map((row) => row.filter((_, columnIndex) => columnIndex !== index)));
  };

  console.log(data)

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <ExcelImport onImport={handleImport} />
        <ExcelExportSpreadsheet data={data} headers={headers} filename="planilha" />
      </Box>
      <Spreadsheet data={data} onChange={setData} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        {/* Botões de adição */}
        <Box>
          <IconButton variant="text" color="success" onClick={addRow}>
            <PlaylistAddIcon sx={{ fontSize: '30px' }} />
          </IconButton>
          {data.length > 1 && (
            <IconButton variant="text" color="error" onClick={() => deleteRow(data.length - 1)}>
              <DeleteIcon sx={{ fontSize: '30px' }} />
            </IconButton>
          )}
        </Box>
        <Box>
          <IconButton variant="text" color="success" onClick={addColumn}>
            <PostAddIcon sx={{ fontSize: '30px' }} />
          </IconButton>
          {/* Botões de exclusão */}

          {data[0].length > 1 && (
            <IconButton variant="text" color="error" onClick={() => deleteColumn(data[0].length - 1)}>
              <DeleteIcon sx={{ fontSize: '30px' }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default SpreadsheetBasic;
