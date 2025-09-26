import React from "react";
import { Spin } from "antd";

const Loader = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(250, 250, 249, 0.75)", // light transparent background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
    >
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default Loader;
