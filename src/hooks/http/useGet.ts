import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "@tanstack/react-query"
import { useLocalStorage } from "../useLocalStorage"
import { useToast } from "../useToast"

export type UseGet<TResponse> = {
  data?: TResponse
  get: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TResponse, Error>>
  isLoading: boolean
  isRefetching: boolean
}

export interface UseGetOptions {
  key: string[]
  url: RequestInfo | URL
  credentials: boolean
  enabled?: boolean
  onError?: (err: Error) => void
  errorMessage?: string
}

export const useGet = <TResponse>(
  options: UseGetOptions
): UseGet<TResponse> => {
  const [token] = useLocalStorage("token", "")
  const toast = useToast()

  const fetchData = async () => {
    const headers = new Headers()
    headers.set("Content-Type", "application/json")
    if (options.credentials) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    const response = await fetch(options.url, {
      headers,
      credentials: options.credentials ? "include" : undefined,
    })
    if (response.status !== 200) {
      throw Error(response.status + " " + response.statusText)
    }
    const responseData: Promise<TResponse> = response.json()
    return responseData
  }

  const onError = (err: Error) => {
    toast.error(err, options.errorMessage)
    if (options.onError) {
      options.onError(err)
    }
  }

  const query = useQuery([...options.key, options.url], fetchData, {
    enabled: options.enabled,
    onError: onError,
    keepPreviousData: true,
  })

  return {
    data: query.data,
    get: query.refetch,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
  }
}
