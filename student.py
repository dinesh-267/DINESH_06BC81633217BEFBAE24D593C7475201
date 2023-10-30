  def sort_students(student_list):
    sorted_list = sorted(student_list, key=lambda x: x.cgpa, reverse=True)
    return sorted_list


  class Student:
    def _init_(self, name, student_number, cgpa):
        self.name = name
        self.student_number = student_number
        self.cgpa = cgpa

  students = [
    Student("Alice", "S001", 3.8),
    Student("Bob", "S002", 3.9),
    Student("Charlie", "S003", 3.7),
    Student("David", "S004", 3.95),
  ]

  sorted_students = sort_students(students)
  for student in sorted_students:
    print(f"Name: {student.name}, Student Number: {student.student_number}, CGPA: {student.cgpa}")