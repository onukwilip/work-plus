"use client";
import React, { FC, useEffect, useState } from "react";
import css from "@/styles/View-vat.module.scss";
import { Input, Message } from "semantic-ui-react";
import { VATReducerType, VATType, SelectorType } from "../../types";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "@/store/store";
import EditVAT from "./EditVAT";
import { fetchVATAction } from "@/store/vatReducer";
import { AnyAction } from "redux";
import CustomLoader from "./CustomLoader";
import DeleteVAT from "./DeleteVAT";

const VATDetails: React.FC<{
  vat: VATType;
  index: number;
}> = ({ vat, index }) => {
  const dispatch = useDispatch();
  const onEditClick = () => {
    dispatch(
      modalActions.display({
        component: EditVAT as FC<any>,
        properties: { vat },
      })
    );
  };
  const onDeleteClick = () => {
    dispatch(
      modalActions.display({
        component: DeleteVAT as FC<any>,
        properties: { id: vat.id, vat },
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
  const detailVariant = {
    invisible: {
      y: 20,
      opacity: 0.5,
    },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={css["each-vat"]}
      variants={variants}
      initial="down"
      animate="normal"
      transition={{ delay: index / 20, bounce: false }}
    >
      <ul className={css["details-container"]}>
        <motion.li
          variants={detailVariant}
          initial="invisible"
          animate="visible"
          transition={{ delay: 0 / 30 }}
        >
          <i className="fas fa-circle-info"></i> <span>{vat.description}</span>
        </motion.li>
        <motion.li
          variants={detailVariant}
          initial="invisible"
          animate="visible"
          transition={{ delay: 1 / 30 }}
        >
          <i className="fas fa-dollar-sign"></i>{" "}
          <span>{vat["unit price"]}</span>
        </motion.li>
      </ul>
      <div className={css.actions}>
        <span onClick={onEditClick}>
          <i className="fa-solid fa-highlighter"></i> Edit
        </span>
        <span onClick={onDeleteClick}>
          <i className="fa-regular fa-square-minus"></i> Delete
        </span>
      </div>
    </motion.div>
  );
};

const ViewVAT = () => {
  const vatState: VATReducerType = useSelector<SelectorType>(
    (state) => state.vat
  ) as VATReducerType;
  const dispatch = useDispatch();
  const [vat, setVat] = useState<VATType[]>([]);
  const searchVAT = (word: string) => {
    const filteredVATs = vatState.vat.filter(
      (vat) =>
        vat.description.toLowerCase().includes(word.toLowerCase()) ||
        vat["unit price"]?.toString().toLowerCase().includes(word.toLowerCase())
    );
    setVat(filteredVATs);
  };

  useEffect(() => {
    dispatch(fetchVATAction() as unknown as AnyAction);
  }, []);
  useEffect(() => {
    if (Array.isArray(vatState.vat) && vatState.vat.length > 0)
      setVat(vatState.vat);
  }, [vatState.vat]);
  return (
    <>
      <section className={css["view-vat"]}>
        <h3>View VAT</h3>
        <br />
        <div className={css.body}>
          <Input
            className={css.input}
            onChange={(e) => searchVAT(e.target.value)}
            icon="search"
            placeholder="Search..."
          />
          <br />
          <br />
          <div className={css["vat-container"]}>
            {vatState.fetching ? (
              <>
                <CustomLoader />
              </>
            ) : vat.length > 0 ? (
              vat.map((vat, i) => (
                <VATDetails vat={vat} index={i} key={vat.id} />
              ))
            ) : (
              <>
                <Message
                  icon={"404"}
                  header="Oops...!"
                  content="No vat found..."
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewVAT;
