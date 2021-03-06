import axios, { AxiosError, AxiosResponse } from 'axios'
import {
  Heading,
  Pane,
  SelectField,
  Spinner,
  TextareaField,
  TextInputField,
} from 'evergreen-ui'
import { useFormik } from 'formik'
import { ChangeEvent, useEffect, useState } from 'react'
import Mask from 'react-input-mask'
import * as Yup from 'yup'
import { ptForm } from 'yup-locale-pt'
import { message } from 'antd'

import { Head, Menu } from '../../../components'
import { ButtonsForm } from '../../../components/ButtonsForm'
import { configMenu, customersState } from '../../../config'
import {
  BrasilApi,
  CidadesIGBE,
  CustomerData,
  CustomerForm,
} from '../../../models'
import {
  api,
  handleDelete,
  handleError,
  validateCep,
  validateCpfCnpj,
} from '../../../utils'

Yup.setLocale(ptForm)

const initialValues: CustomerForm = {
  id: '',
  fullName: '',
  cpfOrCnpj: '',
  cellPhone: '',
  cep: '',
  street: '',
  number: '',
  district: '',
  state: '',
  city: '',
  typeOfAddress: 'Residencial',
  complement: '',
}

const Customer = (): JSX.Element => {
  const formSchema = Yup.object().shape({
    fullName: Yup.string().required().min(2),
    cpfOrCnpj: Yup.string()
      .required()
      .test('IsCpfOrCnpj', 'CPF ou CNPJ invalido', value =>
        validateCpfCnpj(value ?? '')
      ),
    cellPhone: Yup.string().required(),
    cep: Yup.string()
      .required()
      .test('IsCEP', 'CEP invalido', value => validateCep(value ?? '')),
    street: Yup.string().required(),
    number: Yup.string().required(),
    district: Yup.string().required(),
    state: Yup.string().required(),
    city: Yup.string().required(),
    complement: Yup.string().nullable(),
  })

  const formik = useFormik({
    validationSchema: formSchema,
    initialValues,
    onSubmit: values => {
      values.cellPhone = values.cellPhone.replace(/[^0-9]/g, '')
      values.cpfOrCnpj = values.cpfOrCnpj.replace(/[^0-9]/g, '')
      if (!values.complement) {
        delete values.complement
      }
      if (values.id) {
        api
          .patch(`customers/${values.id}`, values)
          .then(() => {
            formik.setSubmitting(false)
            message.success('Cliente alterado')
            formik.resetForm()
          })
          .catch((e: AxiosError) => {
            handleError(e)
            formik.setSubmitting(false)
          })
      }
      if (!values.id) {
        api
          .post('customers', values)
          .then(() => {
            formik.setSubmitting(false)
            message.success('Cliente cadastrado')
            formik.resetForm()
          })
          .catch((e: AxiosError) => {
            handleError(e)
            formik.setSubmitting(false)
          })
      }
    },
  })
  const [cep, setCep] = useState<string>(formik.values.cep)
  const [cities, setCities] = useState<CidadesIGBE[]>([])
  const [exclude, setExclude] = useState(true)
  const [id, setId] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCep(e.target.value)
    formik.handleChange(e)
  }

  const selectedValue = (value: CustomerData) => {
    if (value) {
      formik.setValues(value)
      setCep(value.cep)
      setExclude(false)
      setId(value.id)
    }
  }

  const handleClear = () => {
    setCep('')
    setCities([])
    setExclude(true)
    formik.resetForm()
  }

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (cep && cep !== '_____-___') {
        console.log('CEP Alterado')
        axios
          .get(`https://brasilapi.com.br/api/cep/v1/${cep}`)
          .then(({ data }: AxiosResponse<BrasilApi>) => {
            formik.setValues({
              city: data.city,
              district: data.neighborhood,
              street: data.street,
              state: data.state,
              cellPhone: formik.values.cellPhone,
              cep,
              complement: formik.values.complement,
              cpfOrCnpj: formik.values.cpfOrCnpj,
              fullName: formik.values.fullName,
              number: formik.values.number,
              typeOfAddress: 'Residencial',
            })
          })
          .catch(() => {
            message.warning('CEP n??o encontrado')
          })
      }
    }, 500)

    return () => clearTimeout(timeOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep])

  useEffect(() => {
    if (formik.values.state) {
      axios
        .get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formik.values.state}/municipios`
        )
        .then(({ data }: AxiosResponse<CidadesIGBE[]>) => {
          setCities(data)
        })
        .catch((e: AxiosError) => {
          message.warning(e.message)
        })
    }
  }, [formik.values.state])

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
            Cadastro de Cliente
          </Heading>
          <Pane
            is="form"
            noValidate
            onSubmit={formik.handleSubmit}
            width="100%"
            paddingX={30}
          >
            <TextInputField
              id="fullName"
              required
              isInvalid={
                formik.touched.fullName && Boolean(formik.errors.fullName)
              }
              label="Nome Completo"
              type="text"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              validationMessage={
                formik.touched.fullName && formik.errors.fullName
              }
            />
            <Pane
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <TextInputField
                id="cpfOrCnpj"
                isInvalid={
                  formik.touched.cpfOrCnpj && Boolean(formik.errors.cpfOrCnpj)
                }
                required
                label="CPF/CNPJ"
                type="text"
                value={formik.values.cpfOrCnpj}
                onChange={formik.handleChange}
                validationMessage={
                  formik.touched.cpfOrCnpj && formik.errors.cpfOrCnpj
                }
              />
              <Mask
                mask="(99) 999-999-999"
                value={formik.values.cellPhone}
                onChange={formik.handleChange}
              >
                {() => (
                  <TextInputField
                    id="cellPhone"
                    isInvalid={
                      formik.touched.cellPhone &&
                      Boolean(formik.errors.cellPhone)
                    }
                    required
                    label="Telefone"
                    type="text"
                    validationMessage={
                      formik.touched.cellPhone && formik.errors.cellPhone
                    }
                  />
                )}
              </Mask>
            </Pane>

            <Mask
              mask="99999-999"
              value={formik.values.cep}
              onChange={handleChange}
            >
              {() => (
                <TextInputField
                  id="cep"
                  isInvalid={formik.touched.cep && Boolean(formik.errors.cep)}
                  required
                  label="CEP"
                  type="text"
                  validationMessage={formik.touched.cep && formik.errors.cep}
                  width="50%"
                />
              )}
            </Mask>

            <TextInputField
              id="street"
              isInvalid={formik.touched.street && Boolean(formik.errors.street)}
              required
              label="Rua"
              type="text"
              value={formik.values.street}
              onChange={formik.handleChange}
              validationMessage={formik.touched.street && formik.errors.street}
            />
            <Pane
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <TextInputField
                id="number"
                isInvalid={
                  formik.touched.number && Boolean(formik.errors.number)
                }
                required
                label="N??mero"
                type="text"
                value={formik.values.number}
                onChange={formik.handleChange}
                validationMessage={
                  formik.touched.number && formik.errors.number
                }
              />
              <TextInputField
                id="complement"
                isInvalid={
                  formik.touched.complement && Boolean(formik.errors.complement)
                }
                label="Complemento"
                type="text"
                value={formik.values.complement}
                onChange={formik.handleChange}
                validationMessage={
                  formik.touched.complement && formik.errors.complement
                }
              />
            </Pane>
            <TextInputField
              id="district"
              isInvalid={
                formik.touched.district && Boolean(formik.errors.district)
              }
              required
              label="Bairro"
              type="text"
              width="60%"
              value={formik.values.district}
              onChange={formik.handleChange}
              validationMessage={
                formik.touched.district && formik.errors.district
              }
            />
            <Pane
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <SelectField
                id="state"
                required
                label="Estado"
                width="40%"
                value={formik.values.state}
                onChange={formik.handleChange}
                validationMessage={formik.touched.state && formik.errors.state}
                isInvalid={formik.touched.state && Boolean(formik.errors.state)}
              >
                {customersState.map((state, index) => (
                  <option key={index} value={state.value}>
                    {state.title}
                  </option>
                ))}
              </SelectField>
              <SelectField
                id="city"
                isInvalid={formik.touched.city && Boolean(formik.errors.city)}
                required
                label="Cidade"
                value={formik.values.city}
                onChange={formik.handleChange}
                validationMessage={formik.touched.city && formik.errors.city}
                width="40%"
              >
                {cities && cities.length > 0 ? (
                  cities.map(city => (
                    <option key={city.id} value={city.nome}>
                      {city.nome}
                    </option>
                  ))
                ) : (
                  <option value="">Selecione</option>
                )}
              </SelectField>
            </Pane>
            <TextareaField label="Observa????es" />
            <ButtonsForm
              disabled={formik.isSubmitting}
              newCLick={handleClear}
              exclude={exclude}
              submit="customers"
              onExclude={() => {
                handleDelete('customers', id, 'Cliente deletado com sucesso')
                handleClear()
              }}
              editClick={{
                isShow: true,
                sortBy: 'fullName',
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

export default Customer
