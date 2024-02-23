import React from 'react';
import Button from '@mui/material/Button';
import GetAppIcon from '@mui/icons-material/GetApp';
//Certifique-se de que o arquivo "PlanilhaExemplo.xlsx" está corretamente localizado na pasta "public/download" do seu projeto React.
const DownloadButton = ({ filename, fileUrl }) => {
    const handleDownload = () => {
        //const fileUrl = 'src/download/planilha_registro.xlsx';
        const fileUrl = process.env.PUBLIC_URL + '/download/' + filename;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename;
        link.click();
    };
    //sx={{ width: '200px' }}
    return (
        <Button color="success" variant="outlined" onClick={handleDownload} startIcon={<GetAppIcon />}>
            Baixar&nbsp;Planilha
        </Button>
    );
};

export default DownloadButton;
