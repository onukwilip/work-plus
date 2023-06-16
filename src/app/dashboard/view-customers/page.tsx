import React from "react";
import css from "@/styles/View-customers.module.scss";
import ViewCustomers from "@/components/View-customers";

const Page = () => {
  return (
    <section className={css["view-customers-tab"]}>
      <ViewCustomers />
    </section>
  );
};

export default Page;
