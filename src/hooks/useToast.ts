import { useToast as useChakraToast } from "@chakra-ui/react"

export const useToast = () => {
  const toast = useChakraToast()

  const success = (message: string) => {
    toast({
      title: message,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const error = (error?: Error, message?: string) => {
    toast({
      title: "Hubo un problema.",
      description: message || error?.message || "",
      status: "error",
      duration: 3000,
      isClosable: true,
    })
  }

  return {
    success,
    error,
  }
}
