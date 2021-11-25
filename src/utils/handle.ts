import { message as toaster } from 'antd'
import { AxiosError } from 'axios'
import { api } from '.'

export const handleError = (e: AxiosError): void => {
  if (e.response) {
    const message: string | string[] = e.response.data.message
    if (typeof message === 'string') {
      toaster.error(message)
    }
    if (Array.isArray(message)) {
      message.map(data => toaster.error(data))
    }
  }
}

export const handleDelete = (
  where: string,
  id: string,
  message: string
): void => {
  if (id) {
    api
      .delete(`${where}/${id}`)
      .then(() => {
        toaster.success(message)
      })
      .catch((e: AxiosError) => {
        handleError(e)
      })
  }
}
