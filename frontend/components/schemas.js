const yup = require('yup')

const errors = {
    fullNameMin: "full name must be at least 3 characters",
    fullNameMax: "full name must be at most 20 characters",
    sizeRequired: "size must be S or M or L"
}

const userSchema = yup.object().shape({
    fullName: yup.string().trim().required()
        .min(3, errors.fullNameMin)
        .max(20, errors.fullNameMax),
    size: yup.string().required(errors.sizeRequired)
})

module.exports = { userSchema }