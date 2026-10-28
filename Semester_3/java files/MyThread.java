import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

// 1. Define the background task
class FileReaderTask implements Runnable {
    private final String fileName;

    // We pass the filename when creating the task
    public FileReaderTask(String fileName) {
        this.fileName = fileName;
    }

    @Override
    public void run() {
        System.out.println("[Thread] Starting to read " + fileName);

        // Open and read the file line by line
        try (BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[Thread Data]: " + line);

                // Slow down the thread slightly so we can visually see it working in parallel
                Thread.sleep(300);
            }
        } catch (IOException e) {
            System.out.println("[Thread ERROR]: " + e.getMessage());
        } catch (InterruptedException e) {
            System.out.println("[Thread]: Interrupted!");
        }

        System.out.println("[Thread] Finished reading file.");
    }
}

// 2. Run the program
public class MyThread {
    public static void main(String[] args) {
        // Create a dummy file path (Make sure to create a local text file to test
        // this!)
        String myFile = "C:\\Users\\zeroy\\OneDrive\\Desktop\\WorkSpace\\university-files\\Semester_3\\java files\\sample.txt";

        // Create the task and give it to a new Thread
        FileReaderTask task = new FileReaderTask(myFile);
        Thread backgroundThread = new Thread(task);

        // Start the background thread
        backgroundThread.start();

        // Meanwhile, the main thread keeps executing this loop instantly!
        for (int i = 1; i <= 20; i++) {
            System.out.println("");
            System.out.println("[Main Engine] I am working on other things... " + i);
            System.out.println("");
            try {
                Thread.sleep(300);
            } catch (InterruptedException ignored) {
            }
        }
    }
}
