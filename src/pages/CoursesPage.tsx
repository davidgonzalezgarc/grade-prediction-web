import { useContext, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Page } from "./Page"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Card,
  CardHeader,
  Container,
  Flex,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  Spacer,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { TbPlus } from "react-icons/tb"
import { Modal } from "../components/Modal"
import {
  CourseCreationForm,
  DndGradeItemType,
} from "../components/course/CourseCreationForm"
import { usePost } from "../hooks/http/usePost"
import { AuthContext } from "../context/AuthContext"
import { UseGet, useGet } from "../hooks/http/useGet"
import { CourseListPage } from "../types/types"
import { Pagination } from "../components/Pagination"
import { Link } from "react-router-dom"

export const CoursesPage = () => {
  const { hasRole } = useContext(AuthContext)
  const [page, setPage] = useState(0)
  const getCourses = useGet<CourseListPage>({
    key: ["getCourses"],
    url: `/api/v1/courses?page=${page}`,
    credentials: true,
  })
  const createCourseModal = useDisclosure()

  const handleChangePage = (nextPage: number) => {
    setPage(nextPage)
  }

  return (
    <Page props={{ p: 4 }}>
      <VStack spacing={5}>
        <Container maxW="container.xl">
          <Flex alignItems="center">
            <Heading>Mis asignaturas</Heading>
            <Spacer />
            {hasRole("TEACHER") && (
              <Button
                size="sm"
                leftIcon={<Icon as={TbPlus} />}
                onClick={createCourseModal.onOpen}
              >
                Crear
              </Button>
            )}
          </Flex>
        </Container>
        <Container maxW="container.xl">
          <VStack spacing={4}>
            {getCourses.data?.content.map((c) => (
              <LinkBox key={"course-" + c.id} as={Card} width="100%">
                <CardHeader as={Heading} size="md">
                  <LinkOverlay as={Link} to={`/courses/${c.id}`}>
                    {c.name}
                  </LinkOverlay>
                </CardHeader>
              </LinkBox>
            ))}
          </VStack>
        </Container>
        <Pagination
          currentPage={page}
          totalPages={getCourses.data?.totalPages || 0}
          onChange={handleChangePage}
          loading={getCourses.isRefetching}
        />
      </VStack>
      <CreateCourseModal
        isOpen={createCourseModal.isOpen}
        onClose={createCourseModal.onClose}
        getCourses={getCourses}
      />
    </Page>
  )
}

type CourseCreationRequest = {
  name: string
  gradeItems: {
    name: string
    percentage: number
    position: number
  }[]
}

const CreateCourseModal = ({
  isOpen,
  onClose,
  getCourses,
}: {
  isOpen: boolean
  onClose: () => void
  getCourses: UseGet<CourseListPage>
}) => {
  const createCourse = usePost<CourseCreationRequest>({
    key: ["createCourse"],
    url: `/api/v1/courses`,
    credentials: true,
    successMessage: "Asignatura creada correctamente.",
    onSuccess: () => {
      getCourses.get()
    },
  })
  const [name, setName] = useState("")
  const [gradeItems, setGradeItems] = useState<DndGradeItemType[]>([
    {
      id: uuidv4(),
      name: "",
      percentage: 50,
    },
  ])

  const handleClickCreate = () => {
    createCourse.post({
      name: name,
      gradeItems: gradeItems.map((gradeItem, i) => {
        return {
          name: gradeItem.name,
          percentage: gradeItem.percentage,
          position: i,
        }
      }),
    })
    onClose()
  }

  const percentagesOverLimit = () => {
    return gradeItems.reduce((n, { percentage }) => n + percentage, 0) > 100
  }

  return (
    <Modal
      title="Crear asignatura"
      isOpen={isOpen}
      actionText="Crear"
      onAction={handleClickCreate}
      actionEnabled={!percentagesOverLimit()}
      onClose={onClose}
    >
      <VStack spacing={4}>
        <CourseCreationForm
          name={name}
          setName={setName}
          gradeItems={gradeItems}
          setGradeItems={setGradeItems}
        />
        <Alert
          status="error"
          display={percentagesOverLimit() ? "block" : "none"}
        >
          <AlertIcon />
          <AlertTitle>
            ¡La suma de los porcentajes no puede ser mayor a 100!
          </AlertTitle>
          <AlertDescription>
            Ajusta los porcentajes para mantenerlos dentro del límite.
          </AlertDescription>
        </Alert>
      </VStack>
    </Modal>
  )
}
