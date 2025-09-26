import React from "react";
import { ToastContainer } from "react-toastify";
import { Layout, Typography } from "antd";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ padding: '16px 0', background: '#FAFAF9', marginTop: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text type="secondary">Copyright &copy; PureBite 2025</Text>
      </div>
      <ToastContainer />
    </AntFooter>
  );
};

export default Footer;
