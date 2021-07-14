import React, { useState, useEffect } from "react";
import produce from "immer";
import { moveInArray } from "../utils";
import baseFlags from "../baseFlags";

import Flag from "../components/Flag";
import { SortableColor, SortableColors } from "../components/Sortable";

import css from "./Editor.module.css";

export const Editor = () => {
  const [flags, setFlags] = useState(() => {
    if (window.localStorage.getItem("flags")) {
      const stored = JSON.parse(window.localStorage.getItem("flags"));
      stored.forEach((item, i) => {
        return { ...baseFlags[i], ...item };
      });
      return stored;
    }
    return baseFlags;
  });

  const [show, setShow] = useState(false);
  useEffect(() => {
    window.localStorage.setItem("flags", JSON.stringify(flags));
  }, [flags]);

  const [copy, setCopy] = useState();
  const onCopy = async () => {
    const data = JSON.stringify(flags);
    await navigator.clipboard.writeText(data);
    setCopy(true);
    setTimeout(() => setCopy(false), 3000);
  };
  const [confirmReset, setConfirmReset] = useState();
  const onReset = () => {
    if (confirmReset) {
      setFlags(baseFlags);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  const onResetFlag = (name) => {
    setFlags(
      produce((draft) => {
        const flag = draft.find((f) => f.name == name);
        flag.colors = baseFlags.find((f) => f.name == name).colors;
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

  const onAddColor = (color, name) => {
    setFlags(
      produce((draft) => {
        const flag = draft.find((f) => f.name == name);
        if (flag && !flag.colors.includes(color)) {
          flag.colors.push(color);
        }
      })
    );
  };

  const onClear = (name) => {
    setFlags(
      produce((draft) => {
        const flag = draft.find((f) => f.name == name);
        if (flag) {
          flag.colors = [];
        }
      })
    );
  };

  return (
    <div className={css.root}>
      <header className={css.header}>
        <h2>Country Flags</h2>
        <button onClick={() => setShow(!show)}>
          {show ? "hide code" : "show code"}
        </button>
        <button onClick={onCopy}>
          {copy ? "copied JSON to clipboard!" : "copy JSON"}
        </button>
        <button onClick={onReset}>
          {confirmReset ? "reset all?" : "reset all"}
        </button>
      </header>
      {show && <pre className={css.code}>{JSON.stringify(flags, null, 2)}</pre>}
      {flags.map((flag, i) => {
        return (
          <div key={i} className={css.row}>
            <div className={css.left}>
              <h3 className={css.name}>
                {i} / {flags.length} — {flag.name} ({flag.code})
              </h3>
              <Flag
                name={flag.name}
                className={css.flag}
                onPick={(color) => onAddColor(color, flag.name)}
              />
            </div>
            <div className={css.right}>
              <div className={css.utils}>
                <h3 style={{ marginRight: 10 }}>{flag.colors.length} colors</h3>

                <button onClick={() => onClear(flag.name)}>clear</button>

                <button onClick={() => onResetFlag(flag.name)}>reset</button>
                <input
                  onKeyPress={(e) =>
                    e.key == "Enter" && onAddColor(e.target.value, flag.name)
                  }
                  placeholder="add color"
                />
              </div>
              <SortableColors
                axis={"xy"}
                distance={1}
                onSortEnd={(move) => onSortEnd(flag.name, move)}
              >
                {flag.colors.map((color, j) => (
                  <SortableColor
                    key={`item-${j}`}
                    index={j}
                    color={color}
                    onDelete={() => onDeleteColor(flag.name, j)}
                  />
                ))}
              </SortableColors>
              <div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Editor;
