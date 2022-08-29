const app = require("./app.js");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");


dotenv.config({ path: "backend/config/config.env" });


connectDatabase();
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");



app.use("/api/v1", noteRoutes);
app.use("/api/v1/user", userRoutes);

app.listen(process.env.PORT, () => {

    console.log(`server at http://localhost:${process.env.PORT}`);
});