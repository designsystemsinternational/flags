import React, { useState, useEffect, useRef } from "react";
import { namedColorToHex } from "../utils";

export const Flag = ({ name, onPick }) => {
  const [SvgFlag, setFlag] = useState(() => () => null);

  useEffect(() => {
    (async () => {
      const flag = await import(`../../data/flag/` + name + `.svg`);

      setFlag(() => flag.default);
    })();
  }, []);

  const onClick = (e) => {
    const getColor = (el) => {
      console.log(el);
      if (el.tagName === "use") {
        return getColor(document.querySelector(el.getAttribute("xlink:href")));
      }

      const color = el.getAttribute("fill") || el.getAttribute("stroke");
      if (color) {
        return color;
      } else if (el.parentNode && el.tagName !== "svg") {
        return getColor(el.parentNode);
      } else {
        return "#000";
      }
    };

    const color = getColor(e.target);

    if (color) onPick(namedColorToHex(color));
  };

  return (
    <div onClick={onClick} style={{ cursor: "crosshair" }}>
      <SvgFlag />
    </div>
  );
};

export default Flag;
