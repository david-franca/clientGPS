import { Button, Pane } from 'evergreen-ui'
import { useRouter } from 'next/router'

interface ButtonsFormProps {
  disabled: boolean
  newCLick: () => void
  redirect: string
}

export const ButtonsForm = ({
  disabled,
  newCLick,
  redirect,
}: ButtonsFormProps): JSX.Element => {
  const router = useRouter()
  return (
    <Pane display="flex" justifyContent="space-around" paddingBottom={20}>
      <Button
        appearance="primary"
        intent="success"
        size="medium"
        width="30%"
        type="submit"
        disabled={disabled}
      >
        Salvar
      </Button>
      <Button
        appearance="primary"
        intent="info"
        size="medium"
        width="30%"
        type="button"
        onClick={newCLick}
      >
        Novo
      </Button>
      <Button
        appearance="primary"
        intent="danger"
        size="medium"
        width="30%"
        type="button"
        onClick={() => router.push(redirect)}
      >
        Cancelar
      </Button>
    </Pane>
  )
}
