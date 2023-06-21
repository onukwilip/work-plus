import React, { FC } from "react";

const ModalContainer: React.FC<{
  Component: FC;
  props: Record<string, any>;
}> = ({ Component, props }) => {
  return (
    <>
      <Component {...props} />
    </>
  );
};

export default ModalContainer;
