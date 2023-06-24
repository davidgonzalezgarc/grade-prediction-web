import React, { createContext, useEffect, useState } from "react"
import { useMutation, UseMutationResult } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useToast } from "@chakra-ui/react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import jwt_decode from "jwt-decode"

export type RegisterRequestDto = {
  name: string
  email: string
  password: string
  role: string
}

export type AuthRequestDto = {
  email: string
  password: string
}

export type AuthResponseDto = {
  token: string
}

type Token = {
  exp: number
  iat: number
  roles: string[]
  name: string
  sub: string
}

export type CurrentUser = {
  name: string
  email: string
  role: string
  isLoggedIn: boolean
}

type AuthContextType = {
  token: string
  register: (request: RegisterRequestDto) => void
  authenticate: (request: AuthRequestDto) => void
  logout: () => void
  isLoggedIn: () => boolean
  isLoading: () => boolean
  hasRole: (role: string) => boolean
  currentUser: CurrentUser | null
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const Auth = ({
  children,
}: {
  children: string | JSX.Element | JSX.Element[]
}) => {
  const [token, saveToken] = useLocalStorage("token", "")
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [token])

  const registerFetch = async (request: RegisterRequestDto) => {
    const response = await fetch(`/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(request),
    })
    if (response.status !== 200)
      throw Error(response.status + " " + response.statusText)
    return response.json()
  }

  const registerQuery = useMutation(["register"], registerFetch, {
    onSuccess: (data: AuthResponseDto) => {
      saveToken(data.token)
      toast({
        title: "Registro correcto.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      navigate("/")
    },
    onError: (error: Error) => {
      toast({
        title: "Hubo un problema.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const register = (request: RegisterRequestDto) => {
    registerQuery.mutate(request)
  }

  const authenticateFetch = async (request: AuthRequestDto) => {
    const response = await fetch(`/api/v1/auth/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(request),
    })
    if (response.status !== 200)
      throw Error(response.status + " " + response.statusText)
    return response.json()
  }

  const authenticateQuery = useMutation(["authenticate"], authenticateFetch, {
    onSuccess: (data: AuthResponseDto) => {
      saveToken(data.token)
      toast({
        title: "Inicio de sesión correcto.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      navigate("/")
    },
    onError: (error: Error) => {
      toast({
        title: "Hubo un problema.",
        description: "Email y/o contraseña incorrecta.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const authenticate = (request: AuthRequestDto) => {
    authenticateQuery.mutate(request)
  }

  const logoutFetch = async () => {
    const response = await fetch(`/api/v1/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
    if (response.status !== 200)
      throw Error(response.status + " " + response.statusText)
  }

  const logoutQuery = useMutation(["logout"], logoutFetch, {
    onSuccess: () => {
      saveToken("")
      toast({
        title: "Cierre de sesión correcto.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      navigate("/")
    },
    onError: (error: Error) => {
      toast({
        title: "Hubo un problema.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const logout = () => {
    logoutQuery.mutate()
  }

  const isLoggedIn = () => {
    return getCurrentUser()?.isLoggedIn || false
  }

  const isLoading = () => {
    return (
      registerQuery.isLoading ||
      authenticateQuery.isLoading ||
      logoutQuery.isLoading
    )
  }

  const decodeToken = (token: string): CurrentUser => {
    const decoded: Token = jwt_decode(token)
    return {
      name: decoded.name,
      email: decoded.sub,
      role: decoded.roles[0],
      isLoggedIn: token !== undefined,
    }
  }

  const getCurrentUser = (): CurrentUser | null => {
    if (token === "") {
      return null
    }
    return decodeToken(token)
  }
/* ... */
  const hasRole = (role: string) => {
    return getCurrentUser()?.role === role
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        register,
        authenticate,
        logout,
        isLoggedIn,
        isLoading,
        currentUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
