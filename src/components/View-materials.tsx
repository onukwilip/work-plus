"use client";
import React, { FC, useEffect, useState } from "react";
import css from "@/styles/View-materials.module.scss";
import { Input, Message } from "semantic-ui-react";
import { MaterialsReducerType, MaterialType, SelectorType } from "../../types";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "@/store/store";
import EditMaterial from "./EditMaterial";
import { fetchMaterialsAction } from "@/store/materialsReducer";
import { AnyAction } from "redux";
import CustomLoader from "./CustomLoader";
import DeleteMaterial from "./DeleteMaterial";

const MaterialDetails: React.FC<{
  material: MaterialType;
  index: number;
}> = ({ material, index }) => {
  const dispatch = useDispatch();
  const onEditClick = () => {
    dispatch(
      modalActions.display({
        component: EditMaterial as FC<any>,
        properties: { material },
      })
    );
  };
  const onDeleteClick = () => {
    dispatch(
      modalActions.display({
        component: DeleteMaterial as FC<any>,
        properties: { id: material.id, material },
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
      className={css["each-material"]}
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
          <i className="fas fa-circle-info"></i>{" "}
          <span>{material.description}</span>
        </motion.li>
        <motion.li
          variants={detailVariant}
          initial="invisible"
          animate="visible"
          transition={{ delay: 1 / 30 }}
        >
          <i className="fas fa-dollar-sign"></i>{" "}
          <span>{material["unit price"]}</span>
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

const ViewMaterials = () => {
  const materialsState: MaterialsReducerType = useSelector<SelectorType>(
    (state) => state.materials
  ) as MaterialsReducerType;
  const dispatch = useDispatch();
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const searchMaterial = (word: string) => {
    const filteredMaterials = materialsState.materials.filter(
      (material) =>
        material.description.toLowerCase().includes(word.toLowerCase()) ||
        material["unit price"]
          ?.toString()
          .toLowerCase()
          .includes(word.toLowerCase())
    );
    setMaterials(filteredMaterials);
  };

  useEffect(() => {
    dispatch(fetchMaterialsAction() as unknown as AnyAction);
  }, []);
  useEffect(() => {
    if (
      Array.isArray(materialsState.materials) &&
      materialsState.materials.length > 0
    )
      setMaterials(materialsState.materials);
  }, [materialsState.materials]);

  return (
    <>
      <section className={css["view-materials"]}>
        <h3>View Materials</h3>
        <br />
        <div className={css.body}>
          <Input
            className={css.input}
            icon="search"
            onChange={(e) => searchMaterial(e.target.value)}
            placeholder="Search..."
          />
          <br />
          <br />
          <div className={css["materials-container"]}>
            {materialsState.fetching ? (
              <>
                <CustomLoader />
              </>
            ) : materials.length > 0 ? (
              materials.map((material, i) => (
                <MaterialDetails
                  material={material}
                  index={i}
                  key={material.id}
                />
              ))
            ) : (
              <>
                <Message
                  icon={"404"}
                  header="Oops...!"
                  content="No materials found..."
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewMaterials;
