import React, { useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../helpers/AuthContext';

function CreatePost() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) navigate("/login");
  }, [authState.status, navigate]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().min(3, "Title too short").required("Title is required"),
    postText: Yup.string().min(10, "Post too short").required("Post content is required"),
  });

  const onSubmit = (data, { resetForm, setSubmitting, setStatus }) => {
    axios.post(`${API_URL}/posts`, data, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then(() => { resetForm(); navigate("/"); })
    .catch((error) => {
      setStatus({ error: "Failed to create post. Please try again." });
      console.error(error);
    })
    .finally(() => setSubmitting(false));
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 font-display sm:text-2xl dark:text-white">Write a post</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Share your thoughts with the community</p>
      </div>

      <div className="p-5 bg-white border-gray-100 shadow-sm card dark:bg-gray-900 dark:border-gray-800 sm:p-8">
        <Formik initialValues={{ title: "", postText: "" }} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, status }) => (
            <Form className="flex flex-col gap-4 sm:gap-5">
              {status?.error && (
                <div className="px-4 py-3 text-sm text-red-600 border border-red-200 rounded-xl bg-red-50 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 font-body">
                  {status.error}
                </div>
              )}
              <div>
                <label className="block text-sm font-display font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                <Field
                  name="title"
                  placeholder="Give your post a compelling title..."
                  autoComplete="off"
                  className="text-sm font-medium text-gray-900 placeholder-gray-400 border-gray-200 input-field bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 font-display sm:text-base"
                />
                <ErrorMessage name="title" component="p" className="mt-1 text-xs text-red-500 dark:text-red-400 font-body" />
              </div>

              <div>
                <label className="block text-sm font-display font-medium text-gray-700 dark:text-gray-300 mb-1.5">Content</label>
                <Field
                  name="postText"
                  as="textarea"
                  placeholder="Write your post here..."
                  autoComplete="off"
                  rows={7}
                  className="text-sm leading-relaxed text-gray-900 placeholder-gray-400 border-gray-200 resize-none input-field bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 sm:text-base"
                />
                <ErrorMessage name="postText" component="p" className="mt-1 text-xs text-red-500 dark:text-red-400 font-body" />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button type="button" onClick={() => navigate("/")} className="flex-1 text-gray-500 btn-ghost sm:flex-none dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 sm:flex-none sm:px-8 py-2.5">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></span>
                      Publishing...
                    </span>
                  ) : 'Publish Post'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreatePost;