package pnc;
import java.util.*;

public class OrderQueue {
    Queue<Order> orderQueue = new LinkedList<>();
    
    public synchronized void produceOrder(Order order) {
        while(orderQueue.size() >= 2) { // Limit the queue size
            try {
                System.out.println("Queue is full. " + order.orderId + " is waiting...");
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        orderQueue.add(order);
        System.out.println("Produced: " + order.orderId + " by " + order.customerName);
        notifyAll(); // Wake up waiting consumers
    }
    
    public synchronized Order consumeOrder() {
        while(orderQueue.isEmpty()) {
            try {
                System.out.println("Queue is empty. Consumer is waiting...");
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        Order order = orderQueue.poll();
        notifyAll(); // Wake up waiting producers
        return order;
    }
}