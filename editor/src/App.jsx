import React, { useState, useEffect } from "react";
import produce from "immer";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import { moveInArray } from "./utils";

import _flags from "../../flags";

import css from "./App.module.css";

export const App = () => {
  const [flags, setFlags] = useState(() => {
    if (window.localStorage.getItem("flags")) {
      return JSON.parse(window.localStorage.getItem("flags"));
    }
    return _flags;
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("flags", JSON.stringify(flags));
  }, [flags]);

  const [copy, setCopy] = useState();
  const onCopy = async () => {
    const data = JSON.stringify(flags, null, 2);
    await navigator.clipboard.writeText(data);
    setCopy(true);
    setTimeout(() => setCopy(false), 3000);
  };

  const onReset = () => {
    setFlags(_flags);
  };

  const onSortEnd = (name, { oldIndex, newIndex }) => {
    setFlags(
      produce((draft) => {
        const flag = draft.find((f) => f.name == name);
        if (flag) {
          moveInArray(flag.colors, oldIndex, newIndex);
        }
      })
    );
  };

  const onDeleteColor = (name, index) => {
    setFlags(
      produce((draft) => {
        const flag = draft.find((f) => f.name == name);
        if (flag) {
          flag.colors.splice(index, 1);
        }
      })
    );
  };

  const onLimit = (name) => {
    setFlags(
      produce((draft) => {
        const flag = draft.find((f) => f.name == name);
        if (flag) {
          flag.colors = flag.colors.slice(0, 3);
        }
      })
    );
  };

  return (
    <div>
      <header>
        <h2>Country Flags</h2>
        <button onClick={() => setShow(!show)}>toggle</button>
        <button onClick={onCopy}>
          {copy ? "copied to clipboard" : "copy"}
        </button>
        <button onClick={onReset}>reset</button>
      </header>
      {show && <pre className={css.code}>{JSON.stringify(flags, null, 2)}</pre>}
      {flags.map((flag, i) => {
        return (
          <div key={i} className={css.row}>
            <img className={css.flag} src={`/${flag.name}.svg`} />
            <div style={{ marginRight: 10 }}>
              <span>{flag.colors.length} colors</span>
              <br />
              <br />
              {flag.colors.length > 3 && (
                <button onClick={() => onLimit(flag.name)}>
                  limit&nbsp;to&nbsp;3
                </button>
              )}
            </div>
            <SortableContainer
              axis={"xy"}
              distance={1}
              onSortEnd={(move) => onSortEnd(flag.name, move)}
            >
              {flag.colors.map((color, j) => (
                <SortableItem
                  key={`item-${j}`}
                  index={j}
                  color={color}
                  onDelete={() => onDeleteColor(flag.name, j)}
                />
              ))}
            </SortableContainer>
          </div>
        );
      })}
    </div>
  );
};

export default App;

const SortableItem = sortableElement(({ color, onDelete }) => {
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

const SortableContainer = sortableContainer(({ children }) => {
  return <div className={css.colors}>{children}</div>;
});
