package pnc;

public class ProducerThread extends Thread {
    OrderQueue orderQueue;

    public ProducerThread(OrderQueue orderQueue) {
        this.orderQueue = orderQueue;
    }

    @Override
    public void run() {
        try {
            for (int i = 0; i < 10; i++) {
                Order order = new Order("Order" + i, "Customer" + i);
                orderQueue.produceOrder(order);
                Thread.sleep(1000); // time taken to prodice is less than time taken to consume.
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}