import intance from "../intances/intance";

export const getRestaurantMenu = async (restaurantId) => {
    const response = await intance.get(
        `/restaurants/${restaurantId}/menu`
    );

    return response.data;
};