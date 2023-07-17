"use client";
import React, { FC, useEffect, useState } from "react";
import css from "@/styles/View-customers.module.scss";
import {
  Button,
  Header,
  Image,
  Input,
  Message,
  Modal,
} from "semantic-ui-react";
import { CustomerReducerType, CustomerType, SelectorType } from "../../types";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "@/store/store";
import EditCustomer from "./EditCustomer";
import { fetchCustomersAction } from "@/store/customersReducer";
import { AnyAction } from "redux";
import CustomLoader from "./CustomLoader";
// const CustomerDetails: React.FC<{
//   customer: { image: string } & CustomerType;
// }> = ({ customer }) => {
//   return (
//     <div className={css["each-customer"]}>
//       <div className={`${css["img-container"]}`}>
//         <div className={css.bg}></div>
//         <img src={customer.image} alt={customer.name} />
//       </div>
//       <ul className={css["details-container"]}>
//         <li>
//           <i className="fa-regular fa-user"></i> <span>{customer.name}</span>
//         </li>
//         <li>
//           <i className="fa-regular fa-envelope-open"></i>{" "}
//           <span>{customer.email}</span>
//         </li>
//         <li>
//           <i className="fa-solid fa-mobile"></i> <span>{customer.phone}</span>
//         </li>
//         <li>
//           <i className="fa-regular fa-address-book"></i>{" "}
//           <span>{customer.address}</span>
//         </li>
//       </ul>
//       <div className={css.actions}>
//         <span>
//           <i className="fa-solid fa-highlighter"></i> Edit
//         </span>
//         <span>
//           <i className="fa-regular fa-square-minus"></i> Delete
//         </span>
//       </div>
//     </div>
//   );
// };

const CustomerDetails: React.FC<{
  customer: CustomerType;
  index: number;
}> = ({ customer, index }) => {
  const dispatch = useDispatch();
  const onEditClick = () => {
    dispatch(
      modalActions.display({
        component: EditCustomer as FC<any>,
        properties: { customer },
      })
    );
  };

  const variants = {
    down: {
      y: 50,
      opacity: 0.5,
    },
    normal: { y: 0, opacity: 1 },
  };
  const imgVariants = {
    small: {
      scale: 0.5,
    },
    normal: { scale: 1 },
  };
  const detailVariant = {
    invisible: {
      y: 20,
      opacity: 0.5,
    },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={css["each-customer"]}
      variants={variants}
      initial="down"
      animate="normal"
      transition={{ delay: index / 20, bounce: false }}
    >
      <div className={`${css["img-container"]}`}>
        <div className={css.bg}></div>
        <motion.img
          src={customer.image}
          variants={imgVariants}
          initial="small"
          animate="normal"
          alt={customer.name}
        />
      </div>
      <ul className={css["details-container"]}>
        <motion.li
          variants={detailVariant}
          initial="invisible"
          animate="visible"
          transition={{ delay: 0 / 30 }}
        >
          <i className="fa-regular fa-user"></i> <span>{customer.name}</span>
        </motion.li>
        <motion.li
          variants={detailVariant}
          initial="invisible"
          animate="visible"
          transition={{ delay: 1 / 30 }}
        >
          <i className="fa-regular fa-envelope-open"></i>{" "}
          <span>{customer.email}</span>
        </motion.li>
        <motion.li
          variants={detailVariant}
          initial="invisible"
          animate="visible"
          transition={{ delay: 2 / 30 }}
        >
          <i className="fa-solid fa-mobile"></i> <span>{customer.phone}</span>
        </motion.li>
        <motion.li
          variants={detailVariant}
          initial="invisible"
          animate="visible"
          transition={{ delay: 3 / 30 }}
        >
          <i className="fa-regular fa-address-book"></i>{" "}
          <span>{customer.address}</span>
        </motion.li>
      </ul>
      <div className={css.actions}>
        <span onClick={onEditClick}>
          <i className="fa-solid fa-highlighter"></i> Edit
        </span>
        <span>
          <i className="fa-regular fa-square-minus"></i> Delete
        </span>
      </div>
    </motion.div>
  );
};

const ViewCustomers = () => {
  const customersState: CustomerReducerType = useSelector<SelectorType>(
    (state) => state.customers
  ) as CustomerReducerType;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomersAction() as unknown as AnyAction);
  }, []);

  return (
    <>
      <section className={css["view-customers"]}>
        <h3>View Customers</h3>
        <br />
        <div className={css.body}>
          <Input className={css.input} icon="search" placeholder="Search..." />
          <br />
          <br />
          <div className={css["customers-container"]}>
            {customersState.fetching ? (
              <>
                <CustomLoader />
              </>
            ) : customersState.customers.length > 0 ? (
              customersState.customers.map((customer, i) => (
                <CustomerDetails
                  customer={customer}
                  index={i}
                  key={customer.email}
                />
              ))
            ) : (
              <>
                <Message
                  icon={"404"}
                  header="Oops...!"
                  content="No customers found..."
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewCustomers;
