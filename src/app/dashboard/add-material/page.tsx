import AddMaterial from "@/components/Add-material";
import AddBulkMaterials from "@/components/Add-bulk-materials";
import React from "react";
import css from "@/styles/Add-material.module.scss";

const Page = () => {
  return (
    <section className={css["add-material-tab"]}>
      <AddMaterial />
      <AddBulkMaterials />
    </section>
  );
};

export default Page;
