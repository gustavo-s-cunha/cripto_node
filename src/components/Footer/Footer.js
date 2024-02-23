import React from "react";
import "./style.css";

function Footer() {
  return (
    <footer className="fixed-bottom overflow-hidden" style={{ maxHeight: "50px", backgroundColor: 'white' }}>
      <div className="footer-left">
        <span className="footer-green">Analise da tabela:</span>
        <span className="footer-green-upper" style={{marginLeft: '10px'}}>coinext</span>
      </div>
      <div className="footer-rigth">
        <p> Att: <a href="https://github.com/gustavo-s-cunha" target="none" rel="gitHub"> Gustavo_s_c</a> </p>
      </div>
    </footer>
  );
}

export default Footer;
