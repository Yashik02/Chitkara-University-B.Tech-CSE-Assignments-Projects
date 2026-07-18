public class Assignment1 {

    public static void oddEven(int n) {
        for (int i = 1; i <= n; i++) {
            if (i % 2 == 0) {
                System.out.println("EVEN -> " + i);
            } else {
                System.out.println("ODD -> " + i);
            }
        }
    }

    public static void printMultiplicationTables(int n) {
        for (int i = 1; i <= n; i++) {
            System.out.println("Table of " + i);
            for (int j = 1; j <= 10; j++) {
                System.out.println(i + " x " + j + " = " + (i * j));
            }
        }
    }

    public static void printPrimesInRange(int start, int end) {
        for (int i = start; i <= end; i++) {
            if (i < 2) {
                continue;
            }
            boolean isPrime = true;
            for (int j = 2; j * j <= i; j++) {
                if (i % j == 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) {
                System.out.println(i);
            }
        }
    }

    public static void guessingGame(int[] guesses) {
        int secret = 27;
        boolean won = false;

        for (int i = 0; i < guesses.length && i < 5; i++) {
            int guess = guesses[i];
            if (guess == secret) {
                System.out.println("Congratulations!");
                won = true;
                break;
            } else if (guess < secret) {
                System.out.println("Too Low");
            } else {
                System.out.println("Too High");
            }
        }

        if (!won) {
            System.out.println("Better Luck Next Time!");
        }
    }

    public static void printStrongNumbers(int start, int end) {
        for (int i = start; i <= end; i++) {
            int temp = i;
            int sum = 0;

            while (temp > 0) {
                int digit = temp % 10;

                int fact = 1;
                for (int j = 1; j <= digit; j++) {
                    fact = fact * j;
                }

                sum = sum + fact;
                temp = temp / 10;
            }

            if (sum == i) {
                System.out.println(i);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("--- Odd Even ---");
        oddEven(5);
        
        System.out.println("\n--- Multiplication Tables ---");
        printMultiplicationTables(2);
        
        System.out.println("\n--- Prime Numbers ---");
        printPrimesInRange(10, 30);
        
        System.out.println("\n--- Guessing Game ---");
        int[] myGuesses = {10, 20, 27};
        guessingGame(myGuesses);
        
        System.out.println("\n--- Strong Numbers ---");
        printStrongNumbers(1, 200);
    }
}