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

import { Head, Menu } from '../../../components'
import { ButtonsForm } from '../../../components/ButtonsForm'
import { configMenu } from '../../../config'
import { DeviceData } from '../../../models'
import { timezone } from '../../../models/timezone.model'
import { api } from '../../../utils'

Yup.setLocale(ptForm)

const initialValues = {
  code: 0,
  description: '',
  model: '',
  equipmentNumber: '',
  phone: '',
  mobileOperator: '',
  chipNumber: '',
  timezone: '',
  note: undefined,
}

const Device = (): JSX.Element => {
  const [code, setCode] = useState(0)
  const [exclude, setExclude] = useState(true)

  const formSchema = Yup.object().shape({
    code: Yup.number()
      .required()
      .typeError('O campo precisa ser um número')
      .positive()
      .integer(),
    description: Yup.string().required(),
    model: Yup.string().required(),
    equipmentNumber: Yup.string().required(),
    phone: Yup.string().required(),
    mobileOperator: Yup.string().required(),
    chipNumber: Yup.string().required(),
    timezone: Yup.string().required(),
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

  const missingNumber = (data: number[]) => {
    let missing
    data.sort((a, b) => a - b)
    for (let i = 1; i <= data.length; i++) {
      if (data[i - 1] !== i) {
        missing = i
        break
      }
    }
    if (!missing) {
      return data[data.length - 1] + 1
    } else {
      return missing
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedValue = (value: any) => {
    if (value) {
      formik.setValues(value)
      setExclude(false)
    }
  }

  useEffect(() => {
    api
      .get('devices')
      .then(({ data }: AxiosResponse<DeviceData[]>) => {
        const codeNumber: number[] = []
        data.forEach(d => {
          codeNumber.push(d.code)
        })
        console.log(codeNumber)
        setCode(missingNumber(codeNumber))
        formik.setFieldValue('code', code)
      })
      .catch((e: AxiosError) => {
        toaster.warning(e.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

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
            Cadastro de Equipamento
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
                id="code"
                required
                isInvalid={formik.touched.code && Boolean(formik.errors.code)}
                label="Código"
                type="number"
                width="20%"
                value={formik.values.code}
                onChange={formik.handleChange}
                validationMessage={formik.touched.code && formik.errors.code}
              />
              <TextInputField
                id="description"
                required
                width="70%"
                isInvalid={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                label="Descrição"
                type="text"
                value={formik.values.description}
                onChange={formik.handleChange}
                validationMessage={
                  formik.touched.description && formik.errors.description
                }
              />
            </Pane>
            <Pane
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <SelectField
                id="model"
                isInvalid={formik.touched.model && Boolean(formik.errors.model)}
                required
                label="Modelo"
                value={formik.values.model}
                onChange={formik.handleChange}
                validationMessage={formik.touched.model && formik.errors.model}
                width="40%"
              >
                <option value="">Selecione</option>
                <option value="SUNTECH">Suntech</option>
                <option value="GT06">GT06</option>
              </SelectField>
              <TextInputField
                id="equipmentNumber"
                required
                isInvalid={
                  formik.touched.equipmentNumber &&
                  Boolean(formik.errors.equipmentNumber)
                }
                label="Número do Equipamento"
                type="text"
                value={formik.values.equipmentNumber}
                onChange={formik.handleChange}
                validationMessage={
                  formik.touched.equipmentNumber &&
                  formik.errors.equipmentNumber
                }
              />
            </Pane>
            <Pane
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <SelectField
                id="mobileOperator"
                isInvalid={
                  formik.touched.mobileOperator &&
                  Boolean(formik.errors.mobileOperator)
                }
                required
                label="Operadora"
                value={formik.values.mobileOperator}
                onChange={formik.handleChange}
                validationMessage={
                  formik.touched.mobileOperator && formik.errors.mobileOperator
                }
                width="40%"
              >
                <option value="">Selecione</option>
                <option value="Claro">Claro</option>
                <option value="Oi">Oi</option>
                <option value="Tim">Tim</option>
                <option value="Vivo">Vivo</option>
                <option value="Vodafone">Vodafone</option>
                <option value="Outras">Outras</option>
              </SelectField>
              <TextInputField
                id="phone"
                required
                isInvalid={formik.touched.phone && Boolean(formik.errors.phone)}
                label="Telefone"
                type="text"
                value={formik.values.phone}
                onChange={formik.handleChange}
                validationMessage={formik.touched.phone && formik.errors.phone}
              />
            </Pane>
            <Pane
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <SelectField
                id="timezone"
                isInvalid={
                  formik.touched.timezone && Boolean(formik.errors.timezone)
                }
                required
                label="Fuso Horário"
                value={formik.values.timezone}
                onChange={formik.handleChange}
                validationMessage={
                  formik.touched.timezone && formik.errors.timezone
                }
                width="40%"
              >
                <option value="">Selecione</option>
                {timezone.map((time, index) => (
                  <option key={index} value={time.value}>
                    {time.text}
                  </option>
                ))}
              </SelectField>
              <TextInputField
                id="chipNumber"
                required
                isInvalid={
                  formik.touched.chipNumber && Boolean(formik.errors.chipNumber)
                }
                label="Número do Chip (ICCID)"
                type="text"
                value={formik.values.chipNumber}
                onChange={formik.handleChange}
                validationMessage={
                  formik.touched.chipNumber && formik.errors.chipNumber
                }
              />
            </Pane>
            <TextareaField label="Observações" />
            <ButtonsForm
              disabled={formik.isSubmitting}
              newCLick={handleClear}
              exclude={exclude}
              editClick={{
                isShow: true,
                sortBy: 'description',
                listOf: 'description',
                getBy: 'devices',
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
