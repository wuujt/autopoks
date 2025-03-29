import React from "react";
import "./textBox.css";
interface TextBoxProps {
  text: string;
}

const TextBox: React.FC<TextBoxProps> = ({ text }) => {
  return (
    <div className="textBox">
      <p>{text}</p>;
    </div>
  );
};

export default TextBox;
