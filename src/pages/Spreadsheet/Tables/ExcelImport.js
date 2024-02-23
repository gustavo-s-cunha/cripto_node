import React from 'react';
import { Box, Button} from '@mui/material';
import * as XLSX from 'xlsx';

export default function ExcelImport({ file, onImport }) {
  const handleFileChange = (e) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      //console.log(jsonData);
      onImport(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  return (<>
    <Box sx={{ mt: 2 }}>
      <Button variant="contained" color="success" onClick={() => { handleFileChange(); }} >
        Analisar tabela
      </Button>
    </Box>
  </>);
}
