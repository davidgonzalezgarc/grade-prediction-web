import {
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"
import { UseGet } from "../../hooks/http/useGet"
import { Course } from "../../types/types"
import { usePost } from "../../hooks/http/usePost"
import { useDelete } from "../../hooks/http/useDelete"
import { useNavigate } from "react-router-dom"

export const ManagementSubPage = ({
  getCourse,
}: {
  getCourse: UseGet<Course>
}) => {
  const navigate = useNavigate()
  const course = getCourse.data
  const putChangeSchoolYear = usePost({
    key: ["putChangeSchoolYear"],
    url: `/api/v1/courses/${course?.id}/change-school-year`,
    credentials: true,
    successMessage: "Curso cambiado de año correctamente.",
    onSuccess: () => {
      getCourse.get()
    },
  })
  const deleteCourse = useDelete({
    key: ["deleteCourse"],
    url: `/api/v1/courses`,
    credentials: true,
    successMessage: "Asignatura eliminada correctamente.",
    onSuccess: () => {
      navigate("/")
    },
  })

  if (getCourse.data === undefined) {
    return <></>
  }

  return (
    <VStack spacing={5}>
      <Container maxW="container.xl">
        <Heading size="md">Gestión</Heading>
      </Container>
      <Card as={Container} maxW="container.xl">
        <CardBody>
          <VStack spacing={8} alignItems="start">
            <VStack spacing={2} alignItems="start">
              <Heading size="md">Cambiar de año escolar</Heading>
              <Text>
                Cambiar de año escolar y empezar uno nuevo. Esta acción no se
                puede deshacer, debes estar seguro antes de realizarlo.
              </Text>
              <Text>
                El año escolar actual es el {Number(course?.schoolYear) + 1 + "º."}
              </Text>
              <Button size="sm" onClick={() => putChangeSchoolYear.post({})}>
                Cambiar de año escolar
              </Button>
            </VStack>
            <VStack spacing={2} alignItems="start">
              <Heading size="md">Eliminar asignatura</Heading>
              <Text>
                La eliminación de la asignatura conlleva la pérdida del
                histórico de calificaciones.
              </Text>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => deleteCourse.delete(course?.id || "")}
                isLoading={deleteCourse.isLoading}
              >
                Eliminar asignatura
              </Button>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
