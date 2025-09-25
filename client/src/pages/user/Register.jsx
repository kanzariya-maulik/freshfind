import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import userService from "../../service/userService";
import { RegisterSchema } from "../../validation-schema/registerSchema";
import { Link } from "react-router-dom";

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
    <div className="container">
      <div className="row p-3 g-3 mt-4 justify-content-center h-100 align-items-center">
        <div className="col-md-6">
          <div className="register-form d-flex flex-column justify-content-center h-100 align-items-center">
            <div className="mb-3 w-75">
              <h2 className="mb-3">Create an account</h2>
              <div className="mb-4">Enter your details below</div>

              <Formik
                initialValues={initialValues}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="login-form">
                    <div className="names d-flex gap-3">
                      <div className="w-50">
                        <Field
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          className="w-100 p-2"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="p"
                          className="error mb-3"
                        />
                      </div>
                      <div className="w-50">
                        <Field
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          className="w-100 p-2"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="p"
                          className="error mb-3"
                        />
                      </div>
                    </div>

                    <Field
                      type="text"
                      name="email"
                      placeholder="Email"
                      className="w-100 p-2"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="error mb-3"
                    />

                    <Field
                      type="text"
                      name="phone"
                      placeholder="Mobile Number"
                      className="w-100 p-2"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="error mb-3"
                    />

                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-100 p-2"
                    />
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="error mb-3"
                    />

                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="w-100 p-2"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="error mb-3"
                    />

                    <button
                      type="submit"
                      className="btn-msg w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Create an account"}
                    </button>
                  </Form>
                )}
              </Formik>

              <div className="mt-4 text-center">
                Already have an account?{" "}
                <Link to="/login" className="dim link ms-2">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
