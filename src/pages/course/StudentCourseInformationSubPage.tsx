import React from "react"
import {
  VStack,
  Container,
  Heading,
  Card,
  CardBody,
  Button,
} from "@chakra-ui/react"
import { useGet } from "../../hooks/http/useGet"
import { usePut } from "../../hooks/http/usePut"
import { StudentCourseInformation } from "../../types/types"
import { Form } from "../../components/form/Form"
import { RadioGroup } from "../../components/form/RadioGroup"
import { NumberInput } from "../../components/form/NumberInput"

type StudentCourseInformationForm = {
  travelTime: string
  weeklyStudyTime: string
  failures: string
  extraEducationalSupport: string
  familyEducationalSupport: string
  extraPaidClasses: string
  absences: number
}

export const StudentCourseInformationSubPage = ({
  courseId,
}: {
  courseId: string
}) => {
  const getStudentCourseInformation = useGet<StudentCourseInformation>({
    key: ["getStudentCourseInformation"],
    url: `/api/v1/courses/${courseId}/students/info`,
    credentials: true,
  })
  const putStudentCourseInformation = usePut<StudentCourseInformation>({
    key: ["putStudentCourseInformation"],
    url: `/api/v1/courses/${courseId}/students/info`,
    credentials: true,
    successMessage: "Información actualizada correctamente.",
  })

  const studentCourseInformationToForm = (
    studentCourseInformation: StudentCourseInformation
  ): StudentCourseInformationForm => {
    return {
      ...studentCourseInformation,
      travelTime: String(studentCourseInformation.travelTime),
      weeklyStudyTime: String(studentCourseInformation.weeklyStudyTime),
      failures: String(studentCourseInformation.failures),
      extraEducationalSupport: studentCourseInformation.extraEducationalSupport
        ? "true"
        : "false",
      familyEducationalSupport:
        studentCourseInformation.familyEducationalSupport ? "true" : "false",
      extraPaidClasses: studentCourseInformation.extraPaidClasses
        ? "true"
        : "false",
    }
  }

  const formToStudentCourseInformation = (
    form: StudentCourseInformationForm
  ): StudentCourseInformation => {
    return {
      ...form,
      travelTime: Number(form.travelTime),
      weeklyStudyTime: Number(form.weeklyStudyTime),
      failures: Number(form.failures),
      extraEducationalSupport: form.extraEducationalSupport === "true",
      familyEducationalSupport: form.familyEducationalSupport === "true",
      extraPaidClasses: form.extraPaidClasses === "true",
    }
  }

  const handleSubmit = (values: StudentCourseInformationForm) => {
    putStudentCourseInformation.put(formToStudentCourseInformation(values))
  }

  if (
    getStudentCourseInformation.isLoading ||
    !getStudentCourseInformation.data
  ) {
    return <>cargando</>
  }
  return (
    <VStack spacing={5}>
      <Container maxW="container.xl">
        <Heading size="md">Mis datos</Heading>
      </Container>
      <Card as={Container} maxW="container.xl">
        <CardBody>
          <Form
            initialValues={studentCourseInformationToForm(
              getStudentCourseInformation.data
            )}
            onSubmit={handleSubmit}
          >
            <VStack spacing={5} alignItems="start">
              <RadioGroup
                name={"travelTime"}
                label={"Tiempo de viaje"}
                radios={[
                  { name: "Menos de 15min", value: "1" },
                  { name: "15 a 30min", value: "2" },
                  { name: "30min a 1h", value: "3" },
                  { name: "Más de 1h", value: "4" },
                ]}
              />
              <RadioGroup
                name={"weeklyStudyTime"}
                label={"Tiempo de estudio semanal"}
                radios={[
                  { name: "Menos de 2h", value: "1" },
                  { name: "2 a 5h", value: "2" },
                  { name: "5 a 10h", value: "3" },
                  { name: "Más de 10h", value: "4" },
                ]}
              />
              <RadioGroup
                name={"failures"}
                label={"Número de repeticiones de la asignatura"}
                radios={[
                  { name: "0", value: "0" },
                  { name: "1", value: "1" },
                  { name: "2", value: "2" },
                  { name: "3 o más", value: "3" },
                ]}
              />
              <RadioGroup
                name={"extraEducationalSupport"}
                label={"Apoyo extra educativo"}
                radios={[
                  { name: "Si", value: "true" },
                  { name: "No", value: "false" },
                ]}
              />
              <RadioGroup
                name={"familyEducationalSupport"}
                label={"Apoyo familiar educativo"}
                radios={[
                  { name: "Si", value: "true" },
                  { name: "No", value: "false" },
                ]}
              />
              <RadioGroup
                name={"extraPaidClasses"}
                label={"Clases particulares"}
                radios={[
                  { name: "Si", value: "true" },
                  { name: "No", value: "false" },
                ]}
              />
              <NumberInput
                name={"absences"}
                label={"Ausencias"}
                min={0}
                max={1000}
              />
              <Button type="submit" size="sm">
                Guardar
              </Button>
            </VStack>
          </Form>
        </CardBody>
      </Card>
    </VStack>
  )
}
