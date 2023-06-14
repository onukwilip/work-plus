import AddVAT from "@/components/Add-vat";
import React from "react";
import css from "@/styles/Add-vat.module.scss";

const Page = () => {
  return (
    <section className={css["add-vat-tab"]}>
      <AddVAT />
    </section>
  );
};

export default Page;
