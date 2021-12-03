import { Popconfirm } from 'antd'
import { AxiosResponse } from 'axios'
import { Button, Dialog, Pane, Select, toaster } from 'evergreen-ui'
import { useState } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { api } from '../utils'

interface ButtonsFormProps {
  disabled: boolean
  newCLick: () => void
  exclude: boolean
  onExclude: () => void
  submit: string
  editClick: {
    isShow: boolean
    sortBy: string
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedValue: (e: any) => void
}

export const ButtonsForm = ({
  disabled,
  newCLick,
  editClick,
  selectedValue,
  exclude,
  onExclude,
  submit,
}: ButtonsFormProps): JSX.Element => {
  const [isShown, setIsShown] = useState(false)
  const [dialogValue, setDialogValue] = useState('')
  const [axiosData, setAxiosData] = useState<never[]>([])

  const handleEdit = (value: string) => {
    if (value) {
      setIsShown(false)
      selectedValue(JSON.parse(value))
    }
    setIsShown(false)
  }

  const handleEditCLick = (value: boolean) => {
    setIsShown(value)
    api
      .get(submit, { params: { where: { deleted: false } } })
      .then(({ data }: AxiosResponse<never[]>) => {
        setAxiosData(
          data.sort((a, b) => {
            return a[editClick.sortBy] === b[editClick.sortBy]
              ? 0
              : a[editClick.sortBy] > b[editClick.sortBy]
              ? 1
              : -1
          })
        )
      })
      .catch(() => {
        toaster.warning('Cliente não encontrado')
      })
  }

  return (
    <Pane display="flex" justifyContent="space-around" paddingBottom={20}>
      <Dialog
        isShown={isShown}
        title="Escolha um para editar"
        onCloseComplete={() => {
          setIsShown(false)
          setDialogValue('')
        }}
        preventBodyScrolling
        confirmLabel="Ok"
        onConfirm={() => handleEdit(dialogValue)}
      >
        <Select
          width="100%"
          value={dialogValue}
          onChange={e => setDialogValue(e.target.value)}
        >
          <option value="" selected>
            Selecione
          </option>
          {axiosData.map((data, index) => (
            <option value={JSON.stringify(data)} key={index}>
              {data[editClick.sortBy]}
            </option>
          ))}
        </Select>
      </Dialog>
      <Button
        appearance="primary"
        intent="success"
        size="medium"
        width="20%"
        type="submit"
        disabled={disabled}
      >
        Salvar
      </Button>
      <Button
        appearance="primary"
        intent="warning"
        size="medium"
        width="20%"
        type="button"
        onClick={() => handleEditCLick(editClick.isShow)}
      >
        Editar
      </Button>
      <Popconfirm
        title="Tem certeza？"
        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        onConfirm={() => onExclude()}
        okText="Sim"
        cancelText="Não"
      >
        <Button
          appearance="primary"
          intent="danger"
          size="medium"
          width="20%"
          type="button"
          disabled={exclude}
        >
          Excluir
        </Button>
      </Popconfirm>
      <Button
        appearance="primary"
        intent="info"
        size="medium"
        width="20%"
        type="button"
        onClick={newCLick}
      >
        Novo
      </Button>
    </Pane>
  )
}
