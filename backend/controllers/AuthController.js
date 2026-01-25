
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

    } catch (error) {
        console.log(error)
        return respond(res, "Error Occured", 500, false);
    }
}
export const signup = async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
        return respond(res, "Error Occured", 500, false);
    }
}

