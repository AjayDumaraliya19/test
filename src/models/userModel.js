const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

// create schema
const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            minlength: [3, "username must be at list 3 characters"],
            maxlength: [50, "username not allowed exceed 50 characters"]
        },
        email: {
            type: String,
            trim: true,
            required: true,
            match: [/^\S+@\S+\.\S+$/, "please valid email address"]
        },
        password: {
            type: String,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Indexes
userSchema.index({ email: 1 });

// Middlewares
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("findOneAndUpdate", async function () {
    const update = this.getUpdate();

    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(update.password, salt);
        this.setUpdate(update);
    }
});

// Method
userSchema.methods.comparePassword = async function (paintext) {
    return await bcrypt.compare(paintext, this.password);
}

module.exports = model("User", userSchema);