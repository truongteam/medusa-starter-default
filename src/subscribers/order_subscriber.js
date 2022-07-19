class OrderNotifierSubscriber {
    constructor({ eventBusService }) {
        eventBusService.subscribe("order.placed", this.handleOrder);
    }

    handleOrder = async (data) => {
        console.log("New Order: " + data.id)
    };
}

export default OrderNotifierSubscriber;