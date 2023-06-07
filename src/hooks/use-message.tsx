import { useState } from "react";

const useMessage = (config: {
  message: string;
  timeout?: number;
  initialState?: boolean;
}) => {
  const [show, showMessage] = useState(config?.initialState || false);

  const displayMessage = () => {
    showMessage(true);

    setTimeout(() => {
      showMessage(false);
    }, config.timeout || 1000);
  };

  return {
    displayMessage,
    message: config.message,
    show: show,
  };
};

export default useMessage;
