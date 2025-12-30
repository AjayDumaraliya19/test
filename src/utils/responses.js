exports.errorRes = (res, sts = 500, message = "something went wrong..!") => {
    return res.status(sts).json({ success: false, message });
};