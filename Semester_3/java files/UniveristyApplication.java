class UniversityApplication {
    abstract static class Person {
        String name;
        int age;

        Person (String name, int age) {
            this.name = name;
            this.age = age;
        }

        void getInfo () {
            System.out.println(name + " " + age);
        }
    }

    static class Employee extends Person{
        String empId;
        int salary;

        Employee(String name, int age, int salary, String id) {
            super(name, age);
            this.empId = id;
            this.salary = salary;
        }


    }   

    static class Student extends Person{
        String stuId;

        Student(String name, int age, String id) {
            super(name, age);
            this.stuId = id;

        }
    }
    public static void main(String[] args) {
        Employee e1 = new Employee("RAHUL", 13, 30000, "a1");

        Person e2 = new Employee("nikhil", 45, 20000, "c2");
        
        System.out.println(e1.name);
        e1.getInfo();
        System.out.println(e2);
        e2.getInfo();
    }
}