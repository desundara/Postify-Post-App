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
    axios.post(`${process.env.REACT_APP_API_URL}/auth`, data)
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
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-display font-bold text-xl">P</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white">Create account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Join Postify today</p>
        </div>

        <div className="card bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <Formik initialValues={{ username: "", password: "" }} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting, status }) => (
              <Form className="flex flex-col gap-4">
                {status?.error && (
                  <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-body">
                    {status.error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-display font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
                  <Field
                    name="username"
                    placeholder="Choose a username"
                    autoComplete="off"
                    className="input-field bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                    className="input-field bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <ErrorMessage name="password" component="p" className="mt-1 text-xs text-red-500 dark:text-red-400 font-body" />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 py-3 w-full text-base">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-display font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
