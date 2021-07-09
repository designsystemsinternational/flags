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

  const onResetFlag = (name) => {
    setFlags(
      produce((draft) => {
        const flag = draft.find((f) => f.name == name);
        flag.colors = _flags.find((f) => f.name == name).colors;
      })
    );
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

  const onAddColor = (e, name) => {
    if (e.key == "Enter") {
      setFlags(
        produce((draft) => {
          const flag = draft.find((f) => f.name == name);
          if (flag) {
            flag.colors.push(e.target.value);
          }
        })
      );
    }
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
    <div className={css.root}>
      <header className={css.header}>
        <h2>Country Flags</h2>
        <button onClick={() => setShow(!show)}>
          {show ? "show code" : "hide code"}
        </button>
        <button onClick={onCopy}>
          {copy ? "copied JSON to clipboard!" : "copy JSON"}
        </button>
        <button onClick={onReset}>reset all</button>
      </header>
      {show && <pre className={css.code}>{JSON.stringify(flags, null, 2)}</pre>}
      {flags.map((flag, i) => {
        return (
          <div key={i} className={css.row}>
            <figure className={css.flag}>
              <h3>{flag.name}</h3>
              <img src={`/${flag.name}.svg`} />
            </figure>
            <div className={css.right}>
              <div className={css.utils}>
                <span style={{ marginRight: 10 }}>
                  {flag.colors.length} colors
                </span>
                {flag.colors.length > 3 && (
                  <button onClick={() => onLimit(flag.name)}>limit to 3</button>
                )}
                <button onClick={() => onResetFlag(flag.name)}>reset</button>
                <input
                  onKeyPress={(e) => onAddColor(e, flag.name)}
                  placeholder="add color"
                />
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
              <div></div>
            </div>
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
