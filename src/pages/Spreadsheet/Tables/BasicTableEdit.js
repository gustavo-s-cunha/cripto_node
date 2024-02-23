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
import { Box, Divider, TextField } from '@mui/material';
import DownloadButton from './DownloadButton';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const columnConfig = [
    { id: 'name', label: 'Dessert (100g serving)', align: 'left' },
    { id: 'calories', label: 'Calories', align: 'right' },
    { id: 'fat', label: 'Fat (g)', align: 'right' },
    { id: 'carbs', label: 'Carbs (g)', align: 'right' },
    { id: 'protein', label: 'Protein (g)', align: 'right' },
];


const BasicTableEdit = () => {
    const [rows, setRows] = useState([]);
    const [editingCell, setEditingCell] = useState(null);
    const [editingCellValue, setEditingCellValue] = useState(null);


    //importação
    const handleImport = (data) => {
        const importedRows = data.map((row) => createData(...row));
        setRows(importedRows);
    };


    const handleCellClick = (rowIndex, columnIndex) => {
        setEditingCell({ rowIndex, columnIndex });
    };

    const handleCellChange = (e, rowIndex, columnIndex) => {
        const updatedRows = rows.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [columnIndex]: e.target.value };
            }
            return row;
        });
        setRows(updatedRows);
    };

    const handleCellBlur = () => {
        // Lógica para salvar as alterações ou descartar a edição
        // Por exemplo, você pode atualizar o estado com os novos valores da célula editada
        // e limpar as informações de edição

        // Exemplo de atualização do estado e limpeza da informação de edição
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[editingCell.rowIndex][editingCell.columnId] = editingCellValue;
            return updatedRows;
        });
        setEditingCell(null);
        setEditingCellValue('');
    };

    console.log(rows)

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <DownloadButton filename="planilha_registro.xlsx" />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ExcelImport onImport={handleImport} />
                    <ExcelExport data={rows} headers={columnConfig.map((column) => column.id)} filename="data" />
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columnConfig.map((column) => (
                                <TableCell key={column.id} align={column.align}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: 'none' } }}>
                                {columnConfig.map((column) => {
                                    const isEditingCell = editingCell?.rowIndex === rowIndex && editingCell?.columnIndex === column.id;
                                    const cellContent = isEditingCell ? (
                                        <TextField
                                            type="text"
                                            color="success"
                                            value={row[column.id]}
                                            variant="standard"
                                            onChange={(e) => handleCellChange(e, rowIndex, column.id)}
                                            onBlur={() => handleCellBlur()}
                                            style={{ width: '90px' }}
                                            sx={{ paddingY: '1px' }}
                                            InputProps={{ style: { border: 'none', textAlign: 'right' } }}
                                        />
                                    ) : (
                                        row[column.id]
                                    );
                                    return (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            onClick={() => handleCellClick(rowIndex, column.id)}
                                            sx={{ width: '90px', border: 'none', height: '60px' }}
                                        >
                                            {cellContent}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>


                </Table>
            </TableContainer>
        </div>
    );
};

export default BasicTableEdit;
