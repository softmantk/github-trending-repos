import 'dotenv/config'
import './db'
import app from "./app";
console.log(process.env) // remove this after you've confirmed it is working

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})


process.on('unhandledRejection', error => console.error('Unhandled Rejection', error?.toString()));


