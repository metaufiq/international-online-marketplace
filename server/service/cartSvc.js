let deduplicateCarts = (carts) => {
    //Deduplicate logic
    let seen = new Map();
    carts = carts.filter(function (cart) {
        let  previous;

        if (seen.hasOwnProperty(cart.id)) {
            previous = seen[cart.id]
            previous.quantity++
            previous.price+= seen[cart.id].price
            return false;
        }else cart.quantity = 1;

        seen[cart.id] = cart;

        return true;
    });
    return carts;
};


module.exports = deduplicateCarts;