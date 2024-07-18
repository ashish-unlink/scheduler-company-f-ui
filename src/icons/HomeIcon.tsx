import React from "react";

export const HomeIcon = () => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="21" height="21" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use href="#image0_9_27" transform="scale(0.015625)" />
        </pattern>
        <image
          id="image0_9_27"
          width="64"
          height="64"
          href="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};
