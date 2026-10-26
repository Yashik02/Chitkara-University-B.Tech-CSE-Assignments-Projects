/*
    Objectives:
    1. Create a class Warehouse with a 2D array named inventory. 
    2. Use a constructor to initialize the warehouse inventory. 
    3. Create displayInventory() to display the warehouse layout. 
    4. The warehouse robot starts from the top-left corner and visits every section by moving around the boundary and then moving inward. 
    5. Create getRobotVisitOrder() to print the number of products in each section in spiral traversal order. 
    6. Create calculateBoundaryStock() to calculate the total products stored in all boundary sections. 
    7. Create findMaximumSection() to identify the section containing the maximum number of products. 
    8. Create an object of Warehouse in main() and demonstrate all operations
 */

public class WarehouseBot {
    int n, m;
    int[][] inventory;

    WarehouseBot(int n, int m) {
        this.n = n;
        this.m = m;
        inventory = new int[n][m];
    }

    public void displayInventory() {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                System.out.print(inventory[i][j] + " ");
            }
            System.out.println();
        }
    }

    public void getRobotVisitOrder() {
        int top = 0, bottom = n - 1, left = 0, right = m - 1;

        while (top <= bottom && left <= right) {
            for (int i = left; i <= right; i++) {
                System.out.print(inventory[top][i] + " ");
            }
            top++;

            for (int i = top; i <= bottom; i++) {
                System.out.print(inventory[i][right] + " ");
            }
            right--;

            if (top <= bottom) {
                for (int i = right; i >= left; i--) {
                    System.out.print(inventory[bottom][i] + " ");
                }
                bottom--;
            }

            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    System.out.print(inventory[i][left] + " ");
                }
                left++;
            }
        }
        System.out.println();
    }

    public int calculateBoundaryStock() {
        int total = 0;

        for (int i = 0; i < n; i++) {
            total += inventory[i][0];
            total += inventory[i][m - 1];
        }

        for (int j = 1; j < m - 1; j++) {
            total += inventory[0][j];
            total += inventory[n - 1][j];
        }

        return total;
    }

    public int findMaximumSection() {
        int max = inventory[0][0];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (inventory[i][j] > max) {
                    max = inventory[i][j];
                }
            }
        }
        return max;
    }


    public static void main(String[] args) {
        WarehouseBot warehouse = new WarehouseBot(3, 4);
        warehouse.inventory = new int[][]{
            {5, 10, 15, 20},
            {25, 30, 35, 40},
            {45, 50, 55, 60}
        };

        System.out.println("Warehouse Inventory:");
        warehouse.displayInventory();

        System.out.println("\nRobot Visit Order (Spiral Traversal):");
        warehouse.getRobotVisitOrder();

        int boundaryStock = warehouse.calculateBoundaryStock();
        System.out.println("\nTotal Products in Boundary Sections: " + boundaryStock);

        int maxSection = warehouse.findMaximumSection();
        System.out.println("Maximum Products in a Section: " + maxSection);

    }
}

