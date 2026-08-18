const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true)
        }

        const isLocalhost = origin === "http://localhost:5173"
        const isConfiguredFrontend = origin === frontendUrl
        const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)

        if (isLocalhost || isConfiguredFrontend || isVercelPreview) {
            return callback(null, true)
        }

        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app