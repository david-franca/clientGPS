import axios, { AxiosError, AxiosResponse } from 'axios'
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
import { validateBr } from 'js-brasil'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import Mask from 'react-input-mask'
import * as Yup from 'yup'
import { ptForm } from 'yup-locale-pt'

import { Head } from '../../../components'
import api from '../../../utils/api.utils'

Yup.setLocale(ptForm)

const initialValues = {
  fullName: '',
  cpfOrCnpj: '',
  cellPhone: '',
  cep: '',
  street: '',
  number: '',
  district: '',
  state: '',
  city: '',
  complement: '',
  typeOfAddress: 'Residencial',
}

interface BrasilApi {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service: string
}

interface CidadesIGBE {
  id: number
  nome: string
  microrregiao: {
    id: number
    nome: string
    mesorregiao: {
      id: number
      nome: string
      UF: {
        id: number
        nome: string
        sigla: string
        regiao: {
          id: number
          nome: string
          sigla: string
        }
      }
    }
  }
  'regiao-imediata': {
    id: number
    nome: string
    'regiao-intermediara': {
      id: number
      nome: string
      UF: {
        id: number
        nome: string
        sigla: string
        regiao: {
          id: number
          nome: string
          sigla: string
        }
      }
    }
  }
}

const Customer = (): JSX.Element => {
  const router = useRouter()
  const formSchema = Yup.object().shape({
    fullName: Yup.string().required().min(2),
    cpfOrCnpj: Yup.string()
      .required()
      .test('IsCpfOrCnpj', 'CPF ou CNPJ invalido', value =>
        validateBr.cpfcnpj(value ?? '')
      ),
    cellPhone: Yup.string().required(),
    cep: Yup.string()
      .required()
      .test('IsCEP', 'CEP invalido', value => validateBr.cep(value ?? '')),
    street: Yup.string().required(),
    number: Yup.string().required(),
    district: Yup.string().required(),
    state: Yup.string().required(),
    city: Yup.string().required(),
    complement: Yup.string().optional(),
  })

  const formik = useFormik({
    validationSchema: formSchema,
    initialValues,
    onSubmit: values => {
      values.cellPhone = values.cellPhone.replace(/[^0-9]/g, '')
      api
        .post('customers', values)
        .then(() => {
          formik.setSubmitting(false)
          toaster.success('Cliente cadastrado')
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
  const [cep, setCep] = useState<string>(formik.values.cep)
  const [cities, setCities] = useState<CidadesIGBE[]>([])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCep(e.target.value)
    formik.handleChange(e)
  }

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (cep && cep !== '_____-___') {
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
            toaster.warning('CEP não encontrado')
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
          toaster.warning(e.message)
        })
    }
  }, [formik.values.state])

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
                    formik.touched.cellPhone && Boolean(formik.errors.cellPhone)
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
              isInvalid={formik.touched.number && Boolean(formik.errors.number)}
              required
              label="Número"
              type="text"
              value={formik.values.number}
              onChange={formik.handleChange}
              validationMessage={formik.touched.number && formik.errors.number}
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
              <option value="">Selecione</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MT">Mato Grosso</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
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

export default Customer
