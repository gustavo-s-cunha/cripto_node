import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import * as XLSX from "xlsx";
import GetAppIcon from '@mui/icons-material/GetApp';
//https://docs.sheetjs.com/docs/

export default function ExcelExportSpreadsheet({ data, headers, filename, sheetName, txt }) {
  const exportToExcel = () => {
    const exportData = data.map((row) => row.map((cell) => cell.value) );

    //Had to create a new workbook
    const workbook = XLSX.utils.book_new();
    let worksheet = [];

    if (!headers) {
      worksheet = XLSX.utils.aoa_to_sheet(exportData);

    } else {
      // https://stackblitz.com/edit/xlsx-json-to-sheet-gg26ec?file=src%2Fapp%2Fapp.component.ts
      //Start new worksheet
      worksheet = XLSX.utils.json_to_sheet([]);
      //Add headers
      XLSX.utils.sheet_add_aoa(worksheet, headers);
      
      //Starting in the second row to avoid overriding and skipping headers
      XLSX.utils.sheet_add_json(worksheet, exportData, { origin: 'A2', skipHeader: true });
    }

    // ADD style to table --- NÃO FUNCIONA --- avaliar depois ---  =/
    //https://stackblitz.com/edit/angular6-export-xlsx-xrheux?file=src%2Fapp%2Fapp.component.ts
    /*for (var i in worksheet) {
      //console.log(worksheet[i]);
      if (typeof worksheet[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);

      worksheet[i].s = {
        // styling for all cells
        font: {
          name: 'arial',
          color: '2E7D32'
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
          wrapText: '1', // any truthy value here
        },
        border: {
          right: {
            style: 'thin',
            color: '2E7D32',
          },
          left: {
            style: 'thin',
            color: '2E7D32',
          },
        },
      };

      // https://github.com/SheetJS/sheetjs/issues/906
      if (cell.r == 0) {
        // first row
        worksheet[i].s = {
          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: { rgb: "e8f0f8" },
            bgColor: { rgb: 'e8f0f8' },
          }
        }
      }

      if (cell.r % 2) {
        // every other row
        worksheet[i].s.fill = {
          // background color
          patternType: 'solid',
          fgColor: { rgb: 'B2B2B2' },
          bgColor: { rgb: 'B2B2B2' },
        };
      }
    }*/

    XLSX.utils.book_append_sheet(workbook, worksheet, (sheetName || "Sheet1"));
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 3 }}>
      <Button color="primary" variant="outlined" onClick={exportToExcel} startIcon={<GetAppIcon />}>
        {txt || 'Download'}
      </Button>
    </Box>
  );
}