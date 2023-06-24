import { useContext, useState } from "react"
import {
  Avatar,
  Button,
  Container,
  Heading,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  HStack,
  Card,
  CardBody,
} from "@chakra-ui/react"
import { MdOutlineSave } from "react-icons/md"
import { Pagination } from "../../components/Pagination"
import { UseGet, useGet } from "../../hooks/http/useGet"
import {
  Course,
  CourseStudentGrades,
  GradeItem,
  GradeListPage,
  Prediction,
  StudentGrade as StudentGradeType,
} from "../../types/types"
import { AuthContext } from "../../context/AuthContext"
import { Page } from "../Page"
import { usePut } from "../../hooks/http/usePut"

export const GradesSubPage = ({ course }: { course: Course }) => {
  const { hasRole } = useContext(AuthContext)

  return (
    <VStack spacing={5}>
      <Container maxW="container.xl">
        <Heading size="md">Calificaciones</Heading>
      </Container>
      <Card as={Container} maxW="container.xl">
        <CardBody>
          {hasRole("STUDENT") ? (
            <StudentView course={course} />
          ) : hasRole("TEACHER") ? (
            <TeacherView courseId={course.id} />
          ) : (
            <Page />
          )}
        </CardBody>
      </Card>
    </VStack>
  )
}

const StudentView = ({ course }: { course: Course }) => {
  const getGradeItems = useGet<GradeItem[]>({
    key: ["getCourseGradeItems"],
    url: `/api/v1/grade-items?courseId=${course.id}`,
    credentials: true,
  })

  console.log(course)

  return (
    <VStack spacing={4}>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Prueba</Th>
              <Th>Nota</Th>
              <Th>Predicción</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getGradeItems.data?.map((gi) => {
              return (
                <StudentGrade
                  key={gi.id}
                  courseId={course.id}
                  gradeItem={gi}
                  isPredictable={course.schoolYear > 0}
                />
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}

const StudentGrade = ({
  courseId,
  gradeItem,
  isPredictable,
}: {
  courseId: string
  gradeItem: GradeItem
  isPredictable: boolean
}) => {
  const getGrades = useGet<StudentGradeType[]>({
    key: ["getCourseGradesStudents"],
    url: `/api/v1/grades?courseId=${courseId}`,
    credentials: true,
  })
  const getPrediction = useGet<Prediction>({
    key: [`getGradeItemPrediction-${gradeItem.id}`],
    url: `/api/v1/predictions/predict?gradeItemId=${gradeItem.id}`,
    enabled: false,
    credentials: true,
    errorMessage:
      "No se ha encontrado un modelo entrenado para predecir este elemento de evaluación.",
  })

  const handlePredict = () => {
    getPrediction.get()
  }

  return (
    <Tr>
      <Td>{gradeItem.name}</Td>
      <Td>
        {getGrades.data?.find((g) => g.id.gradeItemId === gradeItem.id)?.grade}
      </Td>
      <Td>
        {getPrediction.data ? (
          getPrediction.data?.prediction
        ) : (
          <Button size="sm" onClick={handlePredict} isDisabled={!isPredictable}>
            Predecir
          </Button>
        )}
      </Td>
    </Tr>
  )
}

const TeacherView = ({ courseId }: { courseId: string }) => {
  const [page, setPage] = useState(0)
  const getGradeItems = useGet<GradeItem[]>({
    key: ["getCourseGradeItems"],
    url: `/api/v1/grade-items?courseId=${courseId}`,
    credentials: true,
  })
  const getGrades = useGet<GradeListPage>({
    key: ["getCourseGradesStudents"],
    url: `/api/v1/grades?courseId=${courseId}&page=${page}`,
    credentials: true,
  })

  const handleChangePage = (nextPage: number) => {
    setPage(nextPage)
  }

  if (getGrades.isLoading || getGradeItems.isLoading) {
    return null
  }

  return (
    <VStack spacing={4}>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Nombre</Th>
              <Th>Correo electrónico</Th>
              {getGradeItems.data?.map((gi) => {
                return <Th key={gi.id}>{gi.name}</Th>
              })}
            </Tr>
          </Thead>
          <Tbody>
            {getGrades.data?.content.map((g) => (
              <GradeTableRow
                key={g.student.email}
                grades={g}
                getGrades={getGrades}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination
        currentPage={page}
        totalPages={getGrades.data?.totalPages || 0}
        onChange={handleChangePage}
        loading={getGrades.isRefetching}
      />
    </VStack>
  )
}

const GradeTableRow = ({
  grades,
  getGrades,
}: {
  grades: CourseStudentGrades
  getGrades: UseGet<GradeListPage>
}) => {
  return (
    <Tr key={grades.student.email}>
      <Td>
        <Avatar size={"sm"} name={grades.student.name} />
      </Td>
      <Td>{grades.student.name}</Td>
      <Td>{grades.student.email}</Td>
      {grades.grades.map((g) => (
        <GradeColumn
          key={g.id.gradeItemId + g.id.studentId}
          grade={g}
          getGrades={getGrades}
        />
      ))}
    </Tr>
  )
}

const GradeColumn = ({
  grade,
  getGrades,
}: {
  grade: StudentGradeType
  getGrades: UseGet<GradeListPage>
}) => {
  const [value, setValue] = useState(grade.grade)
  const [editable, setEditable] = useState(false)
  const putStudentGrade = usePut<StudentGradeType>({
    key: ["putStudentGrade"],
    url: `/api/v1/grades`,
    credentials: true,
    successMessage: "Calificación actualizada.",
  })

  const handleSave = () => {
    setEditable(!editable)
    putStudentGrade.put({
      id: grade.id,
      grade: value,
    })
    getGrades.get()
  }

  return editable ? (
    <Td>
      <HStack>
        <ChakraNumberInput
          size="sm"
          width={16}
          defaultValue={value}
          max={10}
          min={0}
          onChange={(_, valueAsNumber) => setValue(valueAsNumber)}
          isDisabled={!editable}
        >
          <NumberInputField />
        </ChakraNumberInput>
        <IconButton
          size="sm"
          icon={<MdOutlineSave />}
          aria-label="save"
          onClick={handleSave}
        />
      </HStack>
    </Td>
  ) : (
    <Td>
      <Button
        size="sm"
        colorScheme="gray"
        onClick={() => setEditable(!editable)}
      >
        {value}
      </Button>
    </Td>
  )
}
