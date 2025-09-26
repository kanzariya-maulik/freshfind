import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Input, Button, Typography } from "antd";
import userService from "../../service/userService";
import { RegisterSchema } from "../../validation-schema/registerSchema";

const { Title, Text } = Typography;

const Register = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobile: values.phone,
        password: values.password,
        authType: "Email",
      };

      const response = await userService.createUser(payload);
      toast.success(response.message || "Account created successfully!");
      resetForm();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="p-4 shadow-sm rounded">
            <Title level={2} className="text-center mb-3">
              Create an account
            </Title>
            <Text className="text-center d-block mb-4">
              Enter your details below
            </Text>

            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="d-flex gap-2 mb-3">
                    <div className="flex-fill">
                      <Field name="firstName">
                        {({ field }) => (
                          <Input {...field} placeholder="First Name" />
                        )}
                      </Field>
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>
                    <div className="flex-fill">
                      <Field name="lastName">
                        {({ field }) => (
                          <Input {...field} placeholder="Last Name" />
                        )}
                      </Field>
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <Field name="email">
                      {({ field }) => <Input {...field} placeholder="Email" />}
                    </Field>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>

                  <div className="mb-3">
                    <Field name="phone">
                      {({ field }) => (
                        <Input {...field} placeholder="Mobile Number" />
                      )}
                    </Field>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>

                  <div className="mb-3">
                    <Field name="password">
                      {({ field }) => (
                        <Input.Password {...field} placeholder="Password" />
                      )}
                    </Field>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>

                  <div className="mb-3">
                    <Field name="confirmPassword">
                      {({ field }) => (
                        <Input.Password
                          {...field}
                          placeholder="Confirm Password"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Create an account"}
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="mt-4 text-center">
              Already have an account?{" "}
              <Link to="/login" className="ms-2">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
