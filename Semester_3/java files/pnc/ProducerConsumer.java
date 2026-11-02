package pnc;

public class ProducerConsumer {
    public static void main(String[] args) {
        OrderQueue orderQueue = new OrderQueue();
        
        ProducerThread producer = new ProducerThread(orderQueue);
        ConsumerThread consumer = new ConsumerThread(orderQueue);
        
        producer.start();
        consumer.start();
    }
}