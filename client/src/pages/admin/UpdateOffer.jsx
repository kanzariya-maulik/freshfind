import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Card,
  Typography,
  message,
  Row,
  Col,
} from "antd";
import axios from "axios";
import moment from "moment";

const { Title } = Typography;

const UpdateOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/offers/${id}`);
        const data = res.data;

        form.setFieldsValue({
          offerDescription: data.offerDescription || "",
          offerCode: data.offerCode || "",
          discount: data.discount || 0,
          maxDiscount: data.maxDiscount || 0,
          minimumOrder: data.minimumOrder || 0,
          startDate: data.startDate ? moment(data.startDate) : null,
          endDate: data.endDate ? moment(data.endDate) : null,
        });
      } catch (err) {
        console.error(err);
        message.error("Failed to fetch offer details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8000/offers/${id}`, {
        offerDescription: values.offerDescription,
        offerCode: values.offerCode,
        discount: values.discount,
        maxDiscount: values.maxDiscount,
        minimumOrder: values.minimumOrder,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
      });

      message.success("Offer updated successfully!");
      navigate("/admin/offers");
    } catch (err) {
      console.error(err);
      message.error("Failed to update the offer.");
    } finally {
      setLoading(false);
    }
  };

  const validateEndDate = (_, value) => {
    const startDate = form.getFieldValue("startDate");
    if (startDate && value && value.isSameOrBefore(startDate)) {
      return Promise.reject(new Error("End date must be after start date."));
    }
    return Promise.resolve();
  };

  if (loading) return <p>Loading offer data...</p>;

  return (
    <div>
      <Title level={2} className="mt-4">
        Update Offer
      </Title>

      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/offers">Offers</Link>
        </li>
        <li className="breadcrumb-item active">Update Offer</li>
      </ol>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Offer Description"
                name="offerDescription"
                rules={[
                  { required: true, message: "Offer description is required" },
                  { min: 5, message: "Must be at least 5 characters" },
                ]}
              >
                <Input placeholder="Enter offer description" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Offer Code"
                name="offerCode"
                rules={[
                  { required: true, message: "Offer code is required" },
                  {
                    pattern: /^[A-Z0-9]{3,10}$/,
                    message: "3-10 uppercase letters or numbers",
                  },
                ]}
              >
                <Input placeholder="Enter offer code" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Discount (%)"
                name="discount"
                rules={[
                  { required: true, message: "Discount is required" },
                  {
                    type: "number",
                    min: 1,
                    max: 100,
                    message: "Discount must be between 1 and 100",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={1} max={100} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Maximum Discount Amount"
                name="maxDiscount"
                rules={[
                  { required: true, message: "Maximum discount is required" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Minimum Order Amount"
                name="minimumOrder"
                rules={[
                  { required: true, message: "Minimum order is required" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: "Start date is required" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="End Date"
                name="endDate"
                rules={[
                  { required: true, message: "End date is required" },
                  { validator: validateEndDate },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Updating..." : "Update Offer"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateOffer;
