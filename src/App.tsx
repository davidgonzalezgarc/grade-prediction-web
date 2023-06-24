import { useContext } from "react"
import {
  ChakraProvider,
  ColorModeScript,
} from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Footer } from "./components/Footer"
import { Page } from "./pages/Page"
import { GuestHomePage } from "./pages/GuestHomePage"
import { LogInPage } from "./pages/LogInPage"
import { SignUpPage } from "./pages/SignUpPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import theme from "./theme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Auth, AuthContext } from "./context/AuthContext"
import { Navbar } from "./components/Navbar"
import { CoursesPage } from "./pages/CoursesPage"
import { CoursePage } from "./pages/course/CoursePage"
import { PersonalInformationPage } from "./pages/PersonalInformationPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
        <Auth>
          <div className="App">
            <Navbar />
            <main className="Main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/data"
                  element={
                    <ProtectedRoute role="STUDENT">
                      <PersonalInformationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <CoursesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <ProtectedRoute>
                      <CoursePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PreAuthRoute>
                      <LogInPage />
                    </PreAuthRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PreAuthRoute>
                      <SignUpPage />
                    </PreAuthRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Auth>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

const Home = () => {
  const { isLoggedIn, isLoading } = useContext(AuthContext)

  if (isLoading()) {
    return <Page />
  }
  if (!isLoggedIn()) {
    return <GuestHomePage />
  }
  return <CoursesPage />
}

const PreAuthRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isLoading } = useContext(AuthContext)

  if (isLoading()) {
    return <Page />
  }
  if (isLoggedIn()) {
    return <Navigate to="/" replace />
  }
  return children
}

const ProtectedRoute = ({
  role,
  children,
}: {
  role?: string
  children: JSX.Element
}) => {
  const { isLoggedIn, isLoading, hasRole } = useContext(AuthContext)

  if (isLoading()) {
    return <Page />
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  if (role && !hasRole(role)) {
    return <Navigate to="/" replace />
  }
  return children
}
