export const respond = (res, message, statuscode, success, payload = null) => {
    const response = { message, success, status: statuscode };
    if (payload !== null) {
        response.payload = payload;
    }
    res.status(response.status).json(response);
};