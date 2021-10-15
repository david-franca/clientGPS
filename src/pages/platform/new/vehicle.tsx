import { AxiosError, AxiosResponse } from 'axios'
import {
  Button,
  Heading,
  Pane,
  SelectField,
  Spinner,
  TextareaField,
  TextInputField,
  toaster,
} from 'evergreen-ui'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { ptForm } from 'yup-locale-pt'

import { Head } from '../../../components'
import { Branch, Customer, Device as Devices } from '../../../models'
import api from '../../../utils/api.utils'

Yup.setLocale(ptForm)

const initialValues = {
  licensePlate: 'RQM-9079',
  type: 'Caminhao',
  brand: 'CHERY',
  color: 'CINZA',
  model: 'CIELO 1.6 16V 119cv 5p',
  observation: '',
  year: 2020,
  customerId: '',
  deviceId: '',
  branchId: '',
}

const Device = (): JSX.Element => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [devices, setDevices] = useState<Devices[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const router = useRouter()
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

  useEffect(() => {
    api
      .get('customers')
      .then(({ data }: AxiosResponse<Customer[]>) => {
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
      .then(({ data }: AxiosResponse<Devices[]>) => {
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
      .then(({ data }: AxiosResponse<Branch[]>) => {
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
    <Pane
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      height="100vh"
      background="blue700"
    >
      <Pane
        overflowY="auto"
        overflowX="auto"
        border={true}
        width={600}
        background="gray200"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        borderRadius={20}
      >
        <Head title="Cliente" />
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
              value={formik.values.licensePlate}
              onChange={formik.handleChange}
              validationMessage={
                formik.touched.licensePlate && formik.errors.licensePlate
              }
            />
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
              <option value="">Selecione</option>
              <option value="Ambulancia">Ambulância</option>
              <option value="Barco">Barco</option>
              <option value="Bitrem">Bitrem</option>
              <option value="Carro">Carro</option>
              <option value="Caminhao">Caminhão</option>
              <option value="Caminhonete">Caminhonete</option>
              <option value="Caminhao_Betoneira">Caminhão Betoneira</option>
              <option value="Caminhao_Pipa">Caminhão Pipa</option>
              <option value="Colheitadeira">Colheitadeira</option>
              <option value="Escavadeira">Escavadeira</option>
              <option value="Moto">Moto</option>
              <option value="Motobomba">Motobomba</option>
              <option value="Motoniveladora">Motoniveladora</option>
              <option value="Onibus">Ônibus</option>
              <option value="Pa_Carregadora">Pá Carregadora</option>
              <option value="Pessoa">Pessoa</option>
              <option value="Semaforo">Semáforo</option>
              <option value="Trator">Trator</option>
              <option value="Trator_de_Esteira">Trator de Esteira</option>
              <option value="Outras">Outros</option>
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
              <option value="">Selecione</option>
              <option value="AMARELO">AMARELO</option>
              <option value="AZUL">AZUL</option>
              <option value="BEGE">BEGE</option>
              <option value="BRANCA">BRANCA</option>
              <option value="CINZA">CINZA</option>
              <option value="DOURADA">DOURADA</option>
              <option value="GRENA">GRENA</option>
              <option value="LARANJA">LARANJA</option>
              <option value="MARROM">MARROM</option>
              <option value="PRATA">PRATA</option>
              <option value="PRETA">PRETA</option>
              <option value="ROSA">ROSA</option>
              <option value="ROXA">ROXA</option>
              <option value="VERDE">VERDE</option>
              <option value="VERMELHA">VERMELHA</option>
              <option value="FANTASIA">FANTASIA</option>
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
              <option key={customer.id}>{customer.fullName}</option>
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
              <option key={device.id}>{device.description}</option>
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
              <option key={branch.id}>{branch.name}</option>
            ))}
          </SelectField>
          <TextareaField label="Observações" />
          <Pane display="flex" justifyContent="space-around" paddingBottom={20}>
            <Button
              appearance="primary"
              intent="success"
              size="medium"
              width="30%"
              type="submit"
              disabled={formik.isSubmitting}
            >
              Salvar
            </Button>
            <Button
              appearance="primary"
              intent="danger"
              size="medium"
              width="30%"
              type="button"
              onClick={() => router.push('/platform')}
            >
              Cancelar
            </Button>
          </Pane>
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

export default Device
