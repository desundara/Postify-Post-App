import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Registration() {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3, "At least 3 characters").max(15, "Max 15 characters").required("Username is required"),
    password: Yup.string().min(4, "At least 4 characters").max(20, "Max 20 characters").required("Password is required"),
  });

  const onSubmit = (data, { setSubmitting, setStatus }) => {
    axios.post(`${API_URL}/auth`, data)
      .then((response) => {
        if (response.data.error) {
          setStatus({ error: response.data.error });
        } else {
          navigate("/login");
        }
      })
      .catch((error) => {
        setStatus({ error: error.response?.data?.error || "Registration failed. Please try again." });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 shadow-lg rounded-2xl bg-brand-600">
            <span className="text-xl font-bold text-white font-display">P</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-display dark:text-white">Create account</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Join Postify today</p>
        </div>

        <div className="p-8 bg-white border-gray-100 shadow-sm card dark:bg-gray-900 dark:border-gray-800">
          <Formik initialValues={{ username: "", password: "" }} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting, status }) => (
              <Form className="flex flex-col gap-4">
                {status?.error && (
                  <div className="px-4 py-3 text-sm text-red-600 border border-red-200 rounded-xl bg-red-50 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 font-body">
                    {status.error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-display font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
                  <Field
                    name="username"
                    placeholder="Choose a username"
                    autoComplete="off"
                    className="text-gray-900 placeholder-gray-400 border-gray-200 input-field bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  />
                  <ErrorMessage name="username" component="p" className="mt-1 text-xs text-red-500 dark:text-red-400 font-body" />
                </div>

                <div>
                  <label className="block text-sm font-display font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    autoComplete="off"
                    className="text-gray-900 placeholder-gray-400 border-gray-200 input-field bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                  />
                  <ErrorMessage name="password" component="p" className="mt-1 text-xs text-red-500 dark:text-red-400 font-body" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-2 text-base btn-primary">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></span>
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <p className="mt-5 text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 dark:text-brand-400 font-display hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
