import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import * as XLSX from 'xlsx';

export default function ExcelExport({ data, headers, filename }) {
    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3 }}>
            <Button color="primary" variant="contained" onClick={exportToExcel}>
                Exportar Planilha
            </Button>
        </Box>
    );
};