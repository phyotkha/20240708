export const signup = async (req, res) => {
    res.send("Test: Sign up user");
    console.log("Signup User")
};

export const login = (req, res) => {
    console.log("Login User");
};

export const logout = (req, res) => { 
    console.log("Logout User");
};