import {
  useMutation as useReactQueryMutation,
  UseMutateFunction,
} from "@tanstack/react-query"
import { useLocalStorage } from "../useLocalStorage"
import { useToast } from "../useToast"

export type UseDelete<TResponse> = {
  delete: UseMutateFunction<TResponse, Error, string, unknown>
  isLoading: boolean
}

export interface UseDeleteOptions<TResponse> {
  key: string[]
  url: RequestInfo | URL
  credentials: boolean
  successMessage?: string
  onSuccess?: (data: TResponse) => void
  onError?: (err: Error) => void
}

export const useDelete = <TResponse = void>(
  options: UseDeleteOptions<TResponse>
): UseDelete<TResponse> => {
  const [token] = useLocalStorage("token", "")
  const toast = useToast()

  const onSuccess = (data: TResponse) => {
    toast.success(options.successMessage || "")
    if (options.onSuccess) {
      options.onSuccess(data)
    }
  }

  const onError = (err: Error) => {
    toast.error(err)
    if (options.onError) {
      options.onError(err)
    }
  }

  const deleteData = async (id: string) => {
    const headers = new Headers()
    headers.set("Content-Type", "application/json")
    if (options.credentials) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    const response = await fetch(`${options.url}/${id}`, {
      method: "DELETE",
      headers,
      credentials: options.credentials ? "include" : undefined,
    })
    if (response.status < 200 || response.status >= 300) {
      throw Error(response.status + " " + response.statusText)
    }
    const responseData: Promise<TResponse> = response.json()
    if (!(responseData instanceof Promise<undefined>)) {
      return response.json()
    }
  }

  const mutation = useReactQueryMutation(options.key, deleteData, {
    onSuccess: onSuccess,
    onError: onError,
  })

  return {
    delete: mutation.mutate,
    isLoading: mutation.isLoading,
  }
}
