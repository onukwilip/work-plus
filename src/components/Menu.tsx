"use client";
import React, { useRef, useState, useEffect } from "react";
import css from "@/styles/Menu.module.scss";
import { MenuClass } from "@/utils/classes";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const menus = [
  new MenuClass("Dashboard", "fa-solid fa-chart-pie", "/dashboard"),
  new MenuClass("customer", "fa-regular fa-user", undefined, [
    new MenuClass(
      "add customer",
      "fa-solid fa-user-plus",
      "/dashboard/add-customer"
    ),
    new MenuClass(
      "view customers",
      "fa-solid fa-users",
      "/dashboard/view-customers"
    ),
  ]),
  new MenuClass("materials", "fa-solid fa-boxes-stacked", undefined, [
    new MenuClass(
      "add material",
      "fa-solid fa-plus",
      "/dashboard/add-material"
    ),
    new MenuClass(
      "view materials",
      "fa-solid fa-cubes-stacked",
      "/dashboard/view-materials"
    ),
  ]),
  new MenuClass("VAT", "fa-solid fa-coins", undefined, [
    new MenuClass("add VAT", "fa-solid fa-coins fa-plus", "/dashboard/add-vat"),
    new MenuClass(
      "view VAT(S)",
      "fa-solid fa-money-check-dollar",
      "/dashboard/view-vat"
    ),
  ]),
  new MenuClass(
    "create order",
    "fa-solid fa-file-invoice-dollar",
    "/dashboard/create-order"
  ),
];

const EachMenu: React.FC<{
  menu: MenuClass;
  nest?: number;
  index?: number;
  submenu?: boolean;
}> = ({ menu, nest = 1, submenu = false, index }) => {
  const [expand, setExpand] = useState(true);
  const icon = useRef<HTMLElement>(null);

  const toogleExpand = () => {
    setExpand((prev) => !prev);
  };

  const onLinkHover = () => {
    icon.current?.classList?.add("fa-bounce");
  };

  const onLinkMouseOut = () => {
    icon.current?.classList?.remove("fa-bounce");
  };

  const variants = {
    initial: {
      x: -100,
      opacity: 0.2,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -150,
      opacity: 0,
    },
  };

  return (
    <>
      <motion.li
        className={css["each-menu"]}
        variants={submenu ? variants : {}}
        initial={"initial"}
        animate={"animate"}
        exit={"exit"}
        transition={{ delay: index ? index / 20 : 0 }}
      >
        <Link
          href={menu?.link || "/dashboard#"}
          onMouseOver={onLinkHover}
          onMouseOut={onLinkMouseOut}
          onClick={toogleExpand}
        >
          <i className={menu?.icon} ref={icon}></i>
          <span> {menu?.name}</span>
        </Link>
        <div className={css["sub-menu-container"]}>
          {menu?.subMenus?.map((menu, i) => (
            <AnimatePresence>
              {expand && (
                <EachMenu
                  menu={menu}
                  key={i}
                  nest={nest + 1}
                  submenu={true}
                  index={i}
                />
              )}
            </AnimatePresence>
          ))}
        </div>
      </motion.li>
    </>
  );
};

const Menu = () => {
  return (
    <div className={css.menu}>
      <ul className={css["menu-list"]}>
        {menus.map((menu, i) => (
          <EachMenu menu={menu} key={i} />
        ))}
      </ul>
    </div>
  );
};

const EachMobileMenu: React.FC<{
  menu: MenuClass;
  index?: number;
  submenu?: boolean;
}> = ({ menu, submenu = false, index }) => {
  const [expand, setExpand] = useState(false);
  const icon = useRef<HTMLElement>(null);
  let isSmaller = typeof window !== "undefined" && window?.innerWidth <= 395;

  const eachMenuRef = useRef<HTMLLIElement>(null);
  const toogleExpand = () => {
    setExpand((prev) => !prev);
  };

  const onLinkHover = () => {
    icon.current?.classList?.add("fa-bounce");
  };

  const onLinkMouseOut = () => {
    icon.current?.classList?.remove("fa-bounce");
  };

  const variants1 = {
    initial: {
      height: 0,
    },
    animate: {
      height: "auto",
    },
    exit: {
      height: 0,
    },
  };
  const variants2 = {
    initial: {
      width: 0,
    },
    animate: {
      width: "auto",
    },
    exit: {
      width: 0,
    },
  };

  const onDocumentClick = (e: MouseEvent) => {
    const clickedElem = e?.target;

    if (!eachMenuRef.current?.contains(clickedElem as any)) {
      setExpand(false);
    }
  };

  useEffect(() => {
    document?.addEventListener("click", onDocumentClick);
    isSmaller = window?.innerWidth <= 395;
    return () => {
      document?.removeEventListener("click", onDocumentClick);
    };
  }, []);

  return (
    <>
      <li className={css["each-mobile-menu"]} ref={eachMenuRef}>
        <Link
          href={menu?.link || "/dashboard#"}
          onMouseOver={onLinkHover}
          onMouseOut={onLinkMouseOut}
          onClick={toogleExpand}
        >
          <i className={menu?.icon} ref={icon}></i>
          <span> {menu?.name}</span>
        </Link>
        <AnimatePresence>
          {expand && (
            <motion.div
              className={css["sub-menu-container"]}
              variants={!isSmaller ? variants1 : variants2}
              initial={"initial"}
              animate={"animate"}
              exit={"exit"}
            >
              {menu?.subMenus?.map((menu, i) => (
                <>
                  {
                    <EachMobileMenu
                      menu={menu}
                      key={i}
                      submenu={true}
                      index={i}
                    />
                  }
                </>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    </>
  );
};

export const MobileMenu = () => {
  return (
    <div className={css["mobile-menu"]}>
      <ul className={css["menu-list"]}>
        {menus.map((menu, i) => (
          <EachMobileMenu menu={menu} key={i} />
        ))}
      </ul>
    </div>
  );
};

export default Menu;
