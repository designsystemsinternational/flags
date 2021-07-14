import React from "react";
import { sortableContainer, sortableElement } from "react-sortable-hoc";

import css from "./Sortable.module.css";

export const SortableColors = sortableContainer(({ children }) => {
  return <div className={css.colors}>{children}</div>;
});

export const SortableColor = sortableElement(({ color, onDelete }) => {
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(e);
  };
  return (
    <div className={css.color}>
      <div className={css.swatch} style={{ backgroundColor: color }} />
      {color}
      &nbsp;&nbsp;
      <a href="#" onClick={onClick}>
        &times;
      </a>
    </div>
  );
});
