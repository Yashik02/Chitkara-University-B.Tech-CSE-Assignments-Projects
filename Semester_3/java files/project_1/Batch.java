import java.util.Arrays;

public class Batch {
    class Student {
        String name;
        int[] marks;
        int sum

        Student(String name, int[] marks) {
            this.name = name;
            this.marks = marks;
        }
    }

    int n, m;
    Student[] students;

    Batch(int n, int m) {
        this.n = n;
        this.m = m;
        students = new Student[n];
        for(int i = 0; i < n; i++) {
            students[i] = new Student("Student " + (i + 1), new int[m]);
        }
    }



   


    
    public static void main(String[] args) {

    }
}

// public class Batch {
//     int n, m;
//     int[][] marks;

//     Batch(int n, int m) {
//         this.n = n;
//         this.m = m;
//         marks = new int[n][m];
//         sortMarks();
//     }

//     public void sortMarks() {
//         // sorting the array row-wise based on sum of all marks for each student
//         Arrays.sort(marks, (a, b) -> Integer.compare(Arrays.stream(b).sum(), Arrays.stream(a).sum()));
//     }

//     public void displayMarks() {
//         for (int i = 0; i < n; i++) {
//             for (int j = 0; j < m; j++) {
//                 System.out.print(marks[i][j] + " ");
//             }
//             System.out.println();
//         }
//     }

//     public int calculateTotal() {
//         int total = 0;
//         for (int i = 0; i < n; i++) {
//             for (int j = 0; j < m; j++) {
//                 total += marks[i][j];
//             }
//         }
//         return total;
//     }

//     public int findTopper() {
//         // array is already sorted in descending order based on total marks, so the first student is the topper
//         return 0;
//     }


    
//     public static void main(String[] args) {
//         Batch batch = new Batch(3, 4);
//         batch.marks[0] = new int[]{85, 90, 78, 92};
//         batch.marks[1] = new int[]{88, 76, 95, 89};
//         batch.marks[2] = new int[]{91, 82, 87, 94};

//         System.out.println("Marks of students:");
//         batch.displayMarks();

//         System.out.println("Total marks of all students: " + batch.calculateTotal());

//         int topperIndex = batch.findTopper();
//         System.out.println("Topper is student at index: " + topperIndex);
//     }
// }