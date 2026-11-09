import React, { useEffect, useState } from "react";

interface EllipsisTextProps {
  text: string;
  width: string;
  size?: number;
  textColor?: string;
}

const EllipsisText: React.FC<EllipsisTextProps> = ({
  text,
  width,
  size,
  textColor,
}) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const adjustText = () => {
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.visibility = "hidden";
      container.style.whiteSpace = "nowrap";
      document.body.appendChild(container);

      const words = text.split(" ");

      setDisplayText(text);

      if (container.scrollWidth > parseFloat(width) && words.length > 0) {
        words.pop();
        container.textContent = words.join(" ") + "...";
        if (container.scrollWidth <= parseFloat(width)) {
          setDisplayText(container.textContent);
        }
      }

      document.body.removeChild(container);
    };

    adjustText();
  }, [text, width]);

  return (
    <div
      style={{
        width: width,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        display: "block",
        fontSize: size,
        color: textColor,
      }}
      className='text-[17px] font-medium leading-6 font-sfpro'
    >
      {displayText}
    </div>
  );
};

export default EllipsisText;
