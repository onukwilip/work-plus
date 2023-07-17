import ViewVAT from "@/components/View-vat";
import React from "react";
import css from "@/styles/View-vat.module.scss";

const Page = () => {
  return (
    <section className={css["view-vat-tab"]}>
      <ViewVAT />
    </section>
  );
};

export default Page;
