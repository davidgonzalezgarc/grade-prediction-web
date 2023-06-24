import { UseMutateFunction } from "@tanstack/react-query"
import { useMutation } from "./useMutation"
import { useToast } from "../useToast"

export type UsePost<TRequest, TResponse> = {
  data?: TResponse
  post: UseMutateFunction<TResponse, Error, TRequest, unknown>
  isLoading: boolean
}

export interface UsePostOptions<TResponse> {
  key: string[]
  url: RequestInfo | URL
  credentials: boolean
  onSuccess?: (data: TResponse) => void
  successMessage?: string
  onError?: (err: Error) => void
  errorMessage?: string
}

export const usePost = <TRequest = object, TResponse = undefined>(
  options: UsePostOptions<TResponse>
): UsePost<TRequest, TResponse> => {
  const toast = useToast()

  const onSuccess = (data: TResponse) => {
    toast.success(options.successMessage || "")
    if (options.onSuccess) {
      options.onSuccess(data)
    }
  }

  const onError = (err: Error) => {
    toast.error(err, options.errorMessage)
    if (options.onError) {
      options.onError(err)
    }
  }

  const mutation = useMutation<TRequest, TResponse>({
    key: options.key,
    url: options.url,
    method: "POST",
    credentials: options.credentials,
    onSuccess: onSuccess,
    onError: onError,
  })

  return {
    data: mutation.data,
    post: mutation.mutate,
    isLoading: mutation.isLoading,
  }
}
