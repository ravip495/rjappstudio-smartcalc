import { useMemo, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonText, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';

interface CourseRow {
  id: number;
  grade: string;
  credits: string;
}

const getLetterGrade = (gpa: number): string => {
  if (gpa >= 3.7) return 'A';
  if (gpa >= 3.3) return 'A-';
  if (gpa >= 3.0) return 'B+';
  if (gpa >= 2.7) return 'B';
  if (gpa >= 2.3) return 'C+';
  if (gpa >= 2.0) return 'C';
  if (gpa >= 1.0) return 'D';
  return 'F';
};

const GPA = () => {
  const [courses, setCourses] = useState<CourseRow[]>([{ id: 1, grade: '', credits: '' }]);
  const [gpaResult, setGpaResult] = useState('');
  const [totalCredits, setTotalCredits] = useState('');
  const [letterGrade, setLetterGrade] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const nextId = useMemo(() => Math.max(...courses.map((course) => course.id), 0) + 1, [courses]);

  const updateCourse = (id: number, field: 'grade' | 'credits', value: string) => {
    setCourses((current) =>
      current.map((course) => (course.id === id ? { ...course, [field]: value } : course))
    );
  };

  const addCourse = () => {
    setCourses((current) => [...current, { id: nextId, grade: '', credits: '' }]);
  };

  const removeCourse = (id: number) => {
    setCourses((current) => (current.length > 1 ? current.filter((course) => course.id !== id) : current));
  };

  const onCalculate = () => {
    let weightedTotal = 0;
    let creditTotal = 0;

    for (const course of courses) {
      if (!course.grade.trim() || !course.credits.trim()) {
        setToastMessage('Please complete all course rows');
        return;
      }

      const grade = Number(course.grade);
      const credits = Number(course.credits);

      if (
        Number.isNaN(grade) ||
        Number.isNaN(credits) ||
        grade < 0 ||
        grade > 4 ||
        credits <= 0
      ) {
        setToastMessage('Each grade must be 0-4 and credits must be greater than 0');
        return;
      }

      weightedTotal += grade * credits;
      creditTotal += credits;
    }

    if (creditTotal === 0) {
      setToastMessage('Total credits cannot be zero');
      return;
    }

    const gpa = weightedTotal / creditTotal;
    setGpaResult(gpa.toFixed(3));
    setTotalCredits(creditTotal.toFixed(1));
    setLetterGrade(getLetterGrade(gpa));
  };

  return (
    <CalculatorLayout title="GPA Calculator">
      <IonText>
        <h3 className="section-heading">Courses</h3>
      </IonText>

      {courses.map((course, index) => (
        <IonCard key={course.id}>
          <IonCardContent>
            <InputField
              label={`Course ${index + 1} Grade (0-4)`}
              value={course.grade}
              onChange={(value) => updateCourse(course.id, 'grade', value)}
              type="number"
              inputMode="decimal"
              max={4}
              min={0}
            />
            <InputField
              label="Credits"
              value={course.credits}
              onChange={(value) => updateCourse(course.id, 'credits', value)}
              type="number"
              inputMode="decimal"
              min={0}
            />

            <IonButton
              expand="block"
              fill="outline"
              color="medium"
              onClick={() => removeCourse(course.id)}
              disabled={courses.length === 1}
            >
              Remove Course
            </IonButton>
          </IonCardContent>
        </IonCard>
      ))}

      <IonButton expand="block" fill="outline" color="primary" onClick={addCourse}>
        Add Course
      </IonButton>

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {gpaResult ? (
        <ResultCard
          title="GPA Result"
          rows={[
            { label: 'GPA', value: gpaResult, color: 'primary' },
            { label: 'Total Credits', value: totalCredits },
            { label: 'Letter Grade', value: letterGrade, color: 'success' }
          ]}
        />
      ) : null}

      <IonToast
        isOpen={Boolean(toastMessage)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color="danger"
        onDidDismiss={() => setToastMessage('')}
      />
    </CalculatorLayout>
  );
};

export default GPA;
