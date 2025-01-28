const express = require("express")
// require("./database/db")
require("./models/AuthModel")
require('dotenv').config()
const AuthRouter = require("./routes/AuthRoutes")
const UserRouter = require("./routes/UserRoutes")
const ProjectRouter = require("./routes/ProjectRoutes")
const ActivityRouter = require("./routes/ActivityRoutes")
const ProjectTeamsRouter = require("./routes/ProjectTeamsRoutes")
const AdminDashboardRouter = require("./routes/AdminDashboardRoutes") 
const StudentProjectRoutes = require("./routes/StudentProjectRoutes")
const PORT = process.env.PORT
const app = express();


app.use(express.json());

app.use("/api/auth" , AuthRouter);
app.use("/api/user" , UserRouter);
app.use("/api/projects" , ProjectRouter);
app.use("/api/activities" , ActivityRouter);
app.use("/api/projectTeams", ProjectTeamsRouter)
app.use("/api/admindashboard" , AdminDashboardRouter);
app.use("/api/studentproject" , StudentProjectRoutes);

app.listen(PORT , () => {
    console.log("listening on port " + PORT);
});