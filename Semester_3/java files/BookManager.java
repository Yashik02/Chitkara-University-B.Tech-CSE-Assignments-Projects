import java.util.*;

public class BookManager {

    //Person -> (Student, Employee). Student -> (BTech, BA)

    static class Book {

        static String libraryName = null;
        static int bookCount = 0;

        private final int bookId;
        String title;
        String author;
        int price;

        Book(String title, String author, int price) {
            bookCount++;
            this.bookId = bookCount-1;
            this.title = title;
            this.author = author;
            this.price = price;

            books.put(this.bookId, this);
        }

        static Map<Integer, Book> books = new HashMap<>();

        public static void viewBooks() {
            for(Book b: books.values()) {
                b.displayBook();
            }
        }

        public static Book searchById (int bookId) {
            return books.getOrDefault(bookId, null);
        }

        public static List<Book> searchByAuthor (String author) {
            List<Book> ans = new ArrayList<>();
            for(Book b: books.values()) {
                if(b.author.equals(author)) {
                    ans.add(b);
                }
            }
            return ans;
        }

        public static int size () {
            return bookCount;
        }

        public int getId() {
            return bookId;
        }

        public void displayBook() {
            System.out.println("=======Book========");
            System.out.println(bookId);
            System.out.println(title);
            System.out.println(author);
            System.out.println(price);
            System.out.println("===================");
        }
    }



    public static void main(String[] args)  {

        Book.libraryName = "chitkara central library";

        Book b1 = new Book("welcome", "prince", 100);
        Book b2 = new Book("wonderous", "kame", 112);
        Book b3 = new Book("the fire", "sing and song", 957);
        Book b4 = new Book("records of fears", "cardio", 323);
        Book b5 = new Book("the street", "prince", 432);
        Book b6 = new Book("TWSA", "TLS123", 4951);

        //Book.viewBooks();
        
        for(Book b : Book.searchByAuthor("prince")) {
            b.displayBook();
        }

        Book.searchById(4).displayBook();

    }
}
