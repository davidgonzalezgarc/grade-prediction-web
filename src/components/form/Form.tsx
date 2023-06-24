import React, { ReactNode } from "react"
import { Formik, Form as FormikForm, FormikProps, FormikValues } from "formik"

type FormProps<T> = {
  initialValues: T
  onSubmit: (values: T) => void
  children: ReactNode | ReactNode[]
}

export const Form = <T extends FormikValues>(props: FormProps<T>) => {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={(values, actions) => {
        props.onSubmit(values)
        actions.setSubmitting(false)
      }}
    >
      <FormikForm>{props.children}</FormikForm>
    </Formik>
  )
}
