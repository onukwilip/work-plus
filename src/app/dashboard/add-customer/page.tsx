import AddCustomer from "@/components/Add-customer";
import AddBulkCustomers from "@/components/Add-bulk-customers";
import React from "react";
import css from "@/styles/Add-customer.module.scss";

const Page = () => {
  return (
    <section className={css["add-customer-tab"]}>
      <AddCustomer />
      <AddBulkCustomers />
    </section>
  );
};

export default Page;
