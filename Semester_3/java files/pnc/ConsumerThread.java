package pnc;

public class ConsumerThread extends Thread {
    OrderQueue orderQueue;

    public ConsumerThread(OrderQueue orderQueue) {
        this.orderQueue = orderQueue;
    }

    @Override
    public void run() {
        try {
            for (int i = 0; i < 10; i++) {
                Order order = orderQueue.consumeOrder();
                System.out.println("Consumed: " + order.orderId + " by " + order.customerName);
                Thread.sleep(2500);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}