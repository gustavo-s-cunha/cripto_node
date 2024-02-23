import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ExcelImport from './ExcelImport';
import ExcelExport from './ExcelExport';
import { Box } from '@mui/material';
import DownloadButton from './DownloadButton';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const BasicTable = () => {
    const [rows, setRows] = useState([]);

    //importação
    const handleImport = (data) => {
        const importedRows = data.map((row) => createData(...row));
        setRows(importedRows);
    };


    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* <DownloadButton filename="PlanilhaExemplo.xlsx" fileUrl="https://example.com/planilha.xlsx" /> */}
                <DownloadButton filename="PlanilhaExemplo.xlsx" />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ExcelImport onImport={handleImport} />
                    <ExcelExport data={rows} headers={['name', 'calories', 'fat', 'carbs', 'protein']} filename="data" />
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Dessert (100g serving)</TableCell>
                            <TableCell align="right">Calories</TableCell>
                            <TableCell align="right">Fat&nbsp;(g)</TableCell>
                            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                            <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default BasicTable;
