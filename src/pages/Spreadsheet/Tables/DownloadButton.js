import React from 'react';
import Button from '@mui/material/Button';
import GetAppIcon from '@mui/icons-material/GetApp';

const DownloadButton = ({ filename, fileUrl }) => {
  const handleDownload = () => {
    const fileurl = '/assets/' + filename;
    const link = document.createElement('a');
    link.href = fileurl;
    link.download = filename;
    link.click();
  };

  return (
    <Button color="success" variant="outlined" onClick={handleDownload} startIcon={<GetAppIcon />}>
      Baixar&nbsp;Planilha
    </Button>
  );
};

export default DownloadButton;
