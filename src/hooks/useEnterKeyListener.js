import { useEffect } from "react";

function useEnterKeyListener(onEnter, value) {
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        if (value !== "") {
          onEnter();
        }
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [onEnter, value]);
}

export default useEnterKeyListener;
