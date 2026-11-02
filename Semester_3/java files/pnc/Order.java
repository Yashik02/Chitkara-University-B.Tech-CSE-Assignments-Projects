package pnc;

public class Order  {
    String orderId;
    String customerName;
    Order(String orderId, String customerName) {
        this.orderId = orderId;
        this.customerName = customerName;
    }
}