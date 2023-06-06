import React from "react";
import css from "@/styles/Header.module.scss";

const Header = () => {
  return (
    <>
      <header className={css.header}>
        <div className={css["logo-container"]}>
          work <span>Plus+</span>
        </div>
      </header>
    </>
  );
};

export default Header;
