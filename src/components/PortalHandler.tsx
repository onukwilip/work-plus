"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ModalContainer from "./ModalContainer";
import { useSelector } from "react-redux";
import { ModalType, SelectorType } from "../../types";

const PortalHandler = () => {
  const target = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const modal: ModalType = useSelector<SelectorType>(
    (state) => state.modal
  ) as ModalType;

  useEffect(() => {
    target.current = document.getElementById("modal");
    setMounted(true);
  }, []);

  return (
    <>
      {mounted &&
        modal.show &&
        modal.props.component &&
        createPortal(
          <ModalContainer
            Component={modal.props.component}
            props={modal.props.properties}
          />,
          target.current as Element
        )}
    </>
  );
};

export default PortalHandler;
