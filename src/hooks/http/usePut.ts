import { useMutation } from "./useMutation"
import { useToast } from "../useToast"

export interface UsePutOptions<TResponse> {
  key: string[]
  url: RequestInfo | URL
  credentials: boolean
  onSuccess?: (data: TResponse) => void
  successMessage?: string
  onError?: (err: Error) => void
}

export const usePut = <TRequest = object, TResponse = undefined>(
  options: UsePutOptions<TResponse>
) => {
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

  const mutation = useMutation<TRequest, TResponse>({
    key: options.key,
    url: options.url,
    method: "PUT",
    credentials: options.credentials,
    onSuccess: onSuccess,
    onError: onError,
  })

  return {
    put: mutation.mutate,
    isLoading: mutation.isLoading,
  }
}
