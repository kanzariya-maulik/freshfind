import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Form, Input, InputNumber, Button, DatePicker, Row, Col } from "antd";
import moment from "moment";

const AddOffer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    offerDescription: "",
    offerCode: "",
    discount: "",
    maxDiscount: "",
    minOrder: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateField = (name, value) => {
    let error = null;

    if (name === "offerDescription") {
      if (!value.trim()) error = "Offer description is required.";
      else if (value.length < 5) error = "Must be at least 5 characters.";
      else if (value.length > 100) error = "Cannot exceed 100 characters.";
    }

    if (name === "offerCode") {
      if (!value.trim()) error = "Offer code is required.";
      else if (!/^[A-Z0-9]+$/.test(value))
        error = "Only uppercase letters and numbers allowed.";
      else if (value.length < 3 || value.length > 10)
        error = "Must be 3-10 characters.";
    }

    if (name === "discount") {
      if (value === null || value === "") error = "Discount is required.";
      else if (value < 1 || value > 100) error = "Discount must be 1-100%.";
    }

    if (name === "maxDiscount" || name === "minOrder") {
      if (value === null || value === "")
        error = `${
          name === "maxDiscount" ? "Max discount" : "Min order"
        } is required.`;
      else if (value <= 0)
        error = `${
          name === "maxDiscount" ? "Max discount" : "Min order"
        } must be > 0.`;
    }

    if (name === "startDate") {
      if (!value) error = "Start date is required.";
    }

    if (name === "endDate") {
      if (!value) error = "End date is required.";
      else if (
        formData.startDate &&
        moment(value).isSameOrBefore(moment(formData.startDate))
      )
        error = "End date must be after start date.";
    }

    return error;
  };

  const handleSubmit = async () => {
    const formErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) formErrors[field] = error;
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        offerDescription: formData.offerDescription,
        offerCode: formData.offerCode,
        discount: parseFloat(formData.discount),
        maxDiscount: parseFloat(formData.maxDiscount),
        minimumOrder: parseFloat(formData.minOrder),
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      await axios.post("http://localhost:8000/offers", payload);

      toast.success("Offer added successfully!");
      setFormData({
        offerDescription: "",
        offerCode: "",
        discount: "",
        maxDiscount: "",
        minOrder: "",
        startDate: "",
        endDate: "",
      });

      setTimeout(() => navigate("/admin/offers"), 1000);
    } catch {
      toast.error("Failed to add offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mt-4">Add New Offer</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/admin/offers">Offers</Link>
        </li>
        <li className="breadcrumb-item active">Add Offer</li>
      </ol>

      <div className="card mb-4">
        <div className="card-body">
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Offer Description" required>
              <Input
                value={formData.offerDescription}
                onChange={(e) =>
                  handleChange("offerDescription", e.target.value)
                }
              />
              {errors.offerDescription && (
                <p className="text-danger">{errors.offerDescription}</p>
              )}
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Offer Code" required>
                  <Input
                    value={formData.offerCode}
                    onChange={(e) => handleChange("offerCode", e.target.value)}
                  />
                  {errors.offerCode && (
                    <p className="text-danger">{errors.offerCode}</p>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Discount (%)" required>
                  <InputNumber
                    style={{ width: "100%" }}
                    min={1}
                    max={100}
                    value={formData.discount}
                    onChange={(value) => handleChange("discount", value)}
                  />
                  {errors.discount && (
                    <p className="text-danger">{errors.discount}</p>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Max Discount" required>
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0.01}
                    value={formData.maxDiscount}
                    onChange={(value) => handleChange("maxDiscount", value)}
                  />
                  {errors.maxDiscount && (
                    <p className="text-danger">{errors.maxDiscount}</p>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Min Order" required>
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0.01}
                    value={formData.minOrder}
                    onChange={(value) => handleChange("minOrder", value)}
                  />
                  {errors.minOrder && (
                    <p className="text-danger">{errors.minOrder}</p>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Start Date" required>
                  <DatePicker
                    style={{ width: "100%" }}
                    value={
                      formData.startDate ? moment(formData.startDate) : null
                    }
                    onChange={(date, dateString) =>
                      handleChange("startDate", dateString)
                    }
                  />
                  {errors.startDate && (
                    <p className="text-danger">{errors.startDate}</p>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="End Date" required>
                  <DatePicker
                    style={{ width: "100%" }}
                    value={formData.endDate ? moment(formData.endDate) : null}
                    onChange={(date, dateString) =>
                      handleChange("endDate", dateString)
                    }
                  />
                  {errors.endDate && (
                    <p className="text-danger">{errors.endDate}</p>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add Offer
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddOffer;
