import java.util.*;

class Student {
    String name;
    int age;
    int marks;
}

public class Practice {

    public static int[] generateNumAndAdditive ( int n ) {
        int num = 0;
        int additive = 0;
        for(int i = 1; i <= n; i++) {
            num *= 10;
            num += i;
            additive *= 10;
            additive += 1;
        }
        return new int[]  {num, additive};
    }

    public static List<Integer> borderElements(int[][] mat) {
        int n = mat.length, m = mat[0].length;
        List<Integer> ans = new ArrayList<>();
        for(int i = 0; i < n; i++){
            for(int j = 0; j < m; j++) {
                if(i == 0 || j == 0 || i == n-1 || j == m-1) {
                    ans.add(mat[i][j]);
                }
            }
        }
        return ans;
    }

    public static int[] nextSmallestElement(int[] arr) {
        int n = arr.length;
        Deque<Integer> stack = new ArrayDeque<Integer>();
        int[] nse = new int[n];
        for(int i = n-1; i >= 0; i--) {
            while(!stack.isEmpty() && arr[stack.peek()] >= arr[i]) {
                stack.pop();
            }
            nse[i] = (stack.isEmpty())? n: stack.peek();
            stack.push(i);
        }

        return nse;
    }

    public static void main(String[] args) {

        int[] arr = {1,3,2,4};
        int[] nse = nextSmallestElement(arr);

        for(int i = 0; i < nse.length; i++) {
            System.out.print(nse[i]);
        }


        int[][] mat = {{1,2,3,4}, {5,6,7,8}, {9,10,11,12}};
        System.out.println(borderElements(mat));
        
        // for(int i = 2; i <= 9; i++) {
        //     int[] numAndAdditive = generateNumAndAdditive(i);
        //     System.out.println(numAndAdditive[0]);
        //     System.out.println(numAndAdditive[1]);
        // }


        Student[] students = new Student[4];

        for(int i = 0; i < 4; i++) {
            students[i] = new Student();
        }

        students[0].name = "yashik";
        students[0].age = 19;
        students[0].marks = 40;

        students[1].name = "saransh";
        students[1].age = 17;
        students[1].marks = 30;

        students[2].name = "ishaan";
        students[2].age = 24;
        students[2].marks = 17;

        students[3].name = "dhruv";
        students[3].age = 14;
        students[3].marks = 60;

        int sum = 0;

        for(int i = 0; i < 4; i++) {
            if(students[i].age < 20) {
                sum += students[i].marks;
            }
        }

        System.out.println(sum);

        String s = "hj";
        System.out.println(s);
    }
}