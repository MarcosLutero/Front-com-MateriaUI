declare module 'react-input-mask' {
    import * as React from 'react';
  
    interface Props {
      mask: string;
      value: string;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
      onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
      [key: string]: any; // Para permitir outras props padrão de um input
    }
  
    const ReactInputMask: React.FC<Props>;
  
    export default ReactInputMask;
  }
  