/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosError, AxiosRequestConfig } from 'axios'
import useSWR from 'swr'
import { api } from '../utils'

export function useAxios<Data = unknown, Error = AxiosError>(
  url: string,
  options: AxiosRequestConfig
) {
  const { data, error } = useSWR<Data, Error>(
    url,
    async (url: string) => {
      const { headers, params } = options
      const response = await api.get(url, {
        headers,
        params,
      })
      return response.data
    },
    { refreshInterval: 30000 }
  )
  return { data, error }
}
