import React from "react";

interface HighlightedTitleProps {
  text: string;
  query: string;
}
const HighlightedTitle = ({ text, query }: HighlightedTitleProps) => {
  const re = new RegExp("(" + query + ")", "gi");

  const splitByQuery = text.split(re);
  if (!query.trim()) {
    return <span>{text}</span>;
  }
  return (
    <span>
      {splitByQuery
        .filter((piece) => piece)
        .map((piece, i) =>
          re.test(piece) ? <b key={i}>{piece}</b> : <span key={i}>{piece}</span>
        )}
    </span>
  );
};

export default HighlightedTitle;
