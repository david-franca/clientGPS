import { AxiosError, AxiosResponse } from 'axios'
import {
  Heading,
  Pane,
  SelectField,
  Spinner,
  TextareaField,
  TextInputField,
  toaster,
} from 'evergreen-ui'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { ptForm } from 'yup-locale-pt'

import { Head } from '../../../components'
import { ButtonsForm } from '../../../components/ButtonsForm'
import { BranchData, BranchForm, CustomerData } from '../../../models'
import { api } from '../../../utils'

Yup.setLocale(ptForm)

const initialValues: BranchForm = {
  name: '',
  customerId: '',
}

const Branch = (): JSX.Element => {
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const formSchema = Yup.object().shape({
    customerId: Yup.string().required().uuid(),
    name: Yup.string().required().min(1),
  })

  const formik = useFormik({
    validationSchema: formSchema,
    initialValues,
    onSubmit: values => {
      api
        .post('branches', values)
        .then(() => {
          formik.setSubmitting(false)
          toaster.success('Filial cadastrada')
          formik.resetForm()
        })
        .catch((e: AxiosError) => {
          if (e.response) {
            const message: string | string[] = e.response.data.message
            if (typeof message === 'string') {
              toaster.danger(message)
            }
            if (Array.isArray(message)) {
              message.map(data => toaster.danger(data))
            }
          }
          formik.setSubmitting(false)
        })
    },
  })

  const selectedValue = (value: BranchData) => {
    if (value) {
      formik.setValues(value)
    }
  }

  useEffect(() => {
    api
      .get('customers')
      .then(({ data }: AxiosResponse<CustomerData[]>) => {
        setCustomers(data)
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          const message: string | string[] = e.response.data.message
          if (typeof message === 'string') {
            toaster.danger(message)
          }
          if (Array.isArray(message)) {
            message.map(data => toaster.danger(data))
          }
        }
      })
  }, [])

  return (
    <Pane
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      height="100vh"
      background="blue700"
    >
      <Pane
        overflowX="auto"
        border={true}
        width={600}
        background="gray200"
        display="flex"
        alignItems="center"
        flexDirection="column"
        borderRadius={20}
      >
        <Head title="Cliente" />
        <Heading is="h3" padding={10}>
          Cadastro de Filial
        </Heading>
        <Pane
          is="form"
          noValidate
          onSubmit={formik.handleSubmit}
          width="100%"
          paddingX={30}
        >
          <Pane
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <SelectField
              id="customerId"
              isInvalid={
                formik.touched.customerId && Boolean(formik.errors.customerId)
              }
              required
              label="Clientes"
              value={formik.values.customerId}
              onChange={formik.handleChange}
              validationMessage={
                formik.touched.customerId && formik.errors.customerId
              }
              width="40%"
            >
              <option value="">Selecione</option>
              {customers && customers.length > 0 ? (
                customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.fullName}
                  </option>
                ))
              ) : (
                <option value="">Selecione</option>
              )}
            </SelectField>
            <TextInputField
              id="name"
              required
              isInvalid={formik.touched.name && Boolean(formik.errors.name)}
              label="Nome da Filial"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              validationMessage={formik.touched.name && formik.errors.name}
            />
          </Pane>
          <TextareaField label="Observações" />
          <ButtonsForm
            disabled={formik.isSubmitting}
            newCLick={() => formik.resetForm()}
            redirect="/platform"
            editClick={{
              isShow: true,
              sortBy: 'name',
              listOf: 'name',
              getBy: 'branches',
            }}
            selectedValue={selectedValue}
          />
          {formik.isSubmitting && (
            <Pane display="flex" alignItems="center" justifyContent="center">
              <Spinner marginY={10} />
            </Pane>
          )}
        </Pane>
      </Pane>
    </Pane>
  )
}

export default Branch
