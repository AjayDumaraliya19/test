const { Schema, model } = require("mongoose");

// create Taks Schema
const taskSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "title is required"],
            minlength: [3, "title must be at list 3 characters"],
            maxlength: [100, "title cannot exceed 100 characters"]
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        status: {
            type: String,
            trim: true,
            enum: {
                values: ["pending", "completed"],
                message: "status must be either pending or completed"
            },
            default: "pendding"
        },
        priority: {
            type: Number,
            required: [true, "priorty is required"],
            enum: {
                values: [1, 2, 3, 4, 5],
                message: "priority must be between 1(low) to 5(high)"
            }
        },
        due_date: {
            type: Date,
            validate: {
                validator: function (value) {
                    return !value || value >= new Date();
                },
                message: "Due date cannot  be in the past"
            }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ due_date: 1 });

module.exports = model("Task", taskSchema);