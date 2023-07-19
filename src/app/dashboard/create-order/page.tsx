import React from "react";
import CreateOrder from "@/components/CreateOrder";
import css from "@/styles/CreateOrder.module.scss";

const Page = () => {
  return (
    <section className={css["create-order-tab"]}>
      <CreateOrder />
    </section>
  );
};

export default Page;
