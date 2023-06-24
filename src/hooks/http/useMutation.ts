import {
  UseMutateFunction,
  useMutation as useReactMutation,
} from "@tanstack/react-query"
import { useLocalStorage } from "../useLocalStorage"

export type UseMutation<TRequest, TResponse> = {
  data?: TResponse
  mutate: UseMutateFunction<TResponse, Error, TRequest, unknown>
  isLoading: boolean
}

export interface UseMutationOptions<TResponse> {
  key: string[]
  url: RequestInfo | URL
  method?: string
  credentials: boolean
  onSuccess?: (data: TResponse) => void
  onError?: (err: Error) => void
}

export const useMutation = <TRequest = object, TResponse = undefined>(
  options: UseMutationOptions<TResponse>
): UseMutation<TRequest, TResponse> => {
  const [token] = useLocalStorage("token", "")

  const fetchData = async (request: TRequest) => {
    const headers = new Headers()
    headers.set("Content-Type", "application/json")
    if (options.credentials) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    const response = await fetch(options.url, {
      method: options.method,
      headers,
      credentials: options.credentials ? "include" : undefined,
      body: JSON.stringify(request),
    })
    if (response.status < 200 || response.status >= 300) {
      throw Error(response.status + " " + response.statusText)
    }
    const responseData: Promise<TResponse> = response.json()
    if (!(responseData instanceof Promise<undefined>)) {
      return response.json()
    }
  }

  const mutation = useReactMutation(options.key, fetchData, {
    onSuccess: options.onSuccess,
    onError: options.onError,
  })

  return {
    data: mutation.data,
    mutate: mutation.mutate,
    isLoading: mutation.isLoading,
  }
}
