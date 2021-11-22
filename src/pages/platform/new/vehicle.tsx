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
import Mask from 'react-input-mask'
import * as Yup from 'yup'
import { ptForm } from 'yup-locale-pt'

import { Head, Menu } from '../../../components'
import { ButtonsForm } from '../../../components/ButtonsForm'
import { configMenu, vehiclesColor, vehiclesType } from '../../../config'
import { BranchData, CustomerData, DeviceData, Vehicle } from '../../../models'
import { api } from '../../../utils'

Yup.setLocale(ptForm)

const initialValues = {
  licensePlate: '',
  type: '',
  brand: '',
  color: '',
  model: '',
  observation: '',
  year: 0,
  customerId: '',
  deviceId: '',
  branchId: '',
}

const Device = (): JSX.Element => {
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [devices, setDevices] = useState<DeviceData[]>([])
  const [branches, setBranches] = useState<BranchData[]>([])
  const [exclude, setExclude] = useState(true)

  const formSchema = Yup.object().shape({
    licensePlate: Yup.string().required(),
    type: Yup.string().required(),
    brand: Yup.string().required(),
    color: Yup.string().required(),
    model: Yup.string().required(),
    observation: Yup.string().required(),
    year: Yup.number().required(),
    customerId: Yup.string().required(),
    deviceId: Yup.string().required(),
    branchId: Yup.string().required(),
  })

  const formik = useFormik({
    validationSchema: formSchema,
    initialValues,
    onSubmit: values => {
      console.log(values)
      api
        .post('devices', values)
        .then(() => {
          formik.setSubmitting(false)
          toaster.success('Equipamento Cadastrado')
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

  const handleClear = () => {
    setExclude(true)
    formik.resetForm()
  }

  const handlePlate = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = String(e.target.value).toUpperCase()
    formik.handleChange(e)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedValue = (value: Vehicle) => {
    if (value) {
      console.log(value)
      formik.setValues(value)
      setExclude(false)
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
        formik.setSubmitting(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    api
      .get('devices')
      .then(({ data }: AxiosResponse<DeviceData[]>) => {
        setDevices(data)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    api
      .get('branches')
      .then(({ data }: AxiosResponse<BranchData[]>) => {
        setBranches(data)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Pane>
      <Pane height="3vh">
        <Head title="Cliente" />
        <Menu config={configMenu} />
      </Pane>
      <Pane
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        height="97vh"
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
          <Heading is="h3" padding={10}>
            Cadastro de Veiculo
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
              <Mask
                mask="aaa-9**9"
                value={formik.values.licensePlate}
                onChange={e => handlePlate(e)}
              >
                {() => (
                  <TextInputField
                    id="licensePlate"
                    required
                    isInvalid={
                      formik.touched.licensePlate &&
                      Boolean(formik.errors.licensePlate)
                    }
                    label="Placa"
                    type="text"
                    width="20%"
                    validationMessage={
                      formik.touched.licensePlate && formik.errors.licensePlate
                    }
                  />
                )}
              </Mask>
              <SelectField
                id="type"
                isInvalid={formik.touched.type && Boolean(formik.errors.type)}
                required
                label="Tipo do Veiculo"
                value={formik.values.type}
                onChange={formik.handleChange}
                validationMessage={formik.touched.type && formik.errors.type}
                width="40%"
              >
                {vehiclesType.map((option, index) => (
                  <option value={option.value} key={index}>
                    {option.title}
                  </option>
                ))}
              </SelectField>
            </Pane>
            <Pane
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <TextInputField
                id="brand"
                required
                isInvalid={formik.touched.brand && Boolean(formik.errors.brand)}
                label="Marca"
                type="text"
                value={formik.values.brand}
                onChange={formik.handleChange}
                validationMessage={formik.touched.brand && formik.errors.brand}
              />
            </Pane>
            <Pane
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <SelectField
                id="color"
                isInvalid={formik.touched.color && Boolean(formik.errors.color)}
                required
                label="Cor"
                value={formik.values.color}
                onChange={formik.handleChange}
                validationMessage={formik.touched.color && formik.errors.color}
                width="40%"
              >
                {vehiclesColor.map((color, index) => (
                  <option key={index} value={color.value}>
                    {color.title}
                  </option>
                ))}
              </SelectField>
              <TextInputField
                id="model"
                required
                isInvalid={formik.touched.model && Boolean(formik.errors.model)}
                label="Modelo"
                type="text"
                value={formik.values.model}
                onChange={formik.handleChange}
                validationMessage={formik.touched.model && formik.errors.model}
              />
            </Pane>
            <Pane
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <TextInputField
                id="year"
                required
                isInvalid={formik.touched.year && Boolean(formik.errors.year)}
                label="Ano"
                type="text"
                value={formik.values.year}
                onChange={formik.handleChange}
                validationMessage={formik.touched.year && formik.errors.year}
              />
            </Pane>
            <SelectField
              id="customerId"
              isInvalid={
                formik.touched.customerId && Boolean(formik.errors.customerId)
              }
              required
              label="Cliente"
              value={formik.values.customerId}
              onChange={formik.handleChange}
              validationMessage={
                formik.touched.customerId && formik.errors.customerId
              }
            >
              <option value="">Selecione</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.fullName}
                </option>
              ))}
            </SelectField>
            <SelectField
              id="deviceId"
              isInvalid={
                formik.touched.deviceId && Boolean(formik.errors.deviceId)
              }
              required
              label="Equipamento"
              value={formik.values.deviceId}
              onChange={formik.handleChange}
              validationMessage={
                formik.touched.deviceId && formik.errors.deviceId
              }
            >
              <option value="">Selecione</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.description}
                </option>
              ))}
            </SelectField>
            <SelectField
              id="branchId"
              isInvalid={
                formik.touched.branchId && Boolean(formik.errors.branchId)
              }
              required
              label="Filial"
              value={formik.values.branchId}
              onChange={formik.handleChange}
              validationMessage={
                formik.touched.branchId && formik.errors.branchId
              }
            >
              <option value="">Selecione</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </SelectField>
            <TextareaField label="Observações" />
            <ButtonsForm
              disabled={formik.isSubmitting}
              newCLick={handleClear}
              exclude={exclude}
              editClick={{
                isShow: true,
                sortBy: 'licensePlate',
                listOf: 'licensePlate',
                getBy: 'vehicles',
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
    </Pane>
  )
}

export default Device
