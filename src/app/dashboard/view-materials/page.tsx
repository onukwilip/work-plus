import ViewMaterials from "@/components/View-materials";
import React from "react";
import css from "@/styles/View-materials.module.scss";

const Page = () => {
  return (
    <section className={css["view-materials-tab"]}>
      <ViewMaterials />
    </section>
  );
};

export default Page;
