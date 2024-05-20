import { keyframes } from '@mui/system'

// Defina a animação de expansão e dissipação dos círculos
export const expandAndFade = keyframes`
  0% {
    box-shadow: 0 0 0px 0px rgba(40, 167, 69, 0.2);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 0px 5px rgba(40, 167, 69, 0.5);
    opacity: 0.7;
  }
  100% {
    box-shadow: 0 0 0px 10px rgba(40, 167, 69, 0);
    opacity: 1;
  }
`

export const expandAndFadeLine = keyframes`
  0% {
    stroke-width: 0;
    opacity: 1;
  }
  50% {
    stroke-width: 5;
    opacity: 0.5;
  }
  100% {
    stroke-width: 10;
    opacity: 1;
  }
`
/* Cor #115c34 */
export const expandAndFadeDarkGreen = keyframes`
  0% {
    box-shadow: 0 0 0px 0px rgba(17, 92, 52, 0.2);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 0px 5px rgba(17, 92, 52, 0.5);
    opacity: 0.7;
  }
  100% {
    box-shadow: 0 0 0px 10px rgba(17, 92, 52, 0);
    opacity: 1;
  }
`

export const expandAndFadeblack = keyframes`
  0% {
    box-shadow: 0 0 0px 0px rgba(0, 0, 0, 0.2);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 0px 5px rgba(0, 0, 0, 0.5);
    opacity: 0.7;
  }
  100% {
    box-shadow: 0 0 0px 10px rgba(0, 0, 0, 0);
    opacity: 1;
  }
`

// Defina a animação de brilho
export const glow = keyframes`
  0% {
    box-shadow: 0 0 0px 0px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.5);
  }
  100% {
    box-shadow: 0 0 0px 0px rgba(0, 0, 0, 0.2);
  }
`

// Defina a animação de expansão de círculos com uma cor mais suave
export const pulse = keyframes`
  0% {
    box-shadow: 0 0 0px 0px rgba(40, 167, 69, 0.2);
  }
  50% {
    box-shadow: 0 0 0px 5px rgba(40, 167, 69, 0.2),
                0 0 0px 10px rgba(40, 167, 69, 0.2);
                0 0 0px 15px rgba(40, 167, 69, 0.2);
  }
  100% {
    box-shadow: 0 0 0px 0px rgba(40, 167, 69, 0.2);
  }
`
