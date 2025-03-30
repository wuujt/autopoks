import React from "react";
import "./alertScreen.css";
interface AlertScreenProp {
  text: string;
}

const AlertScreen: React.FC<AlertScreenProp> = ({ text }) => {
  return (
    <div className="alertScreenContainer">
      <p className="alertScreenText">{text}</p>
    </div>
  );
};

export default AlertScreen;
