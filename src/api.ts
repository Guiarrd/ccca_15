import express from "express";
import { AccountDAODataBase } from "./AccountDAO";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const accountDAO = new AccountDAODataBase();
    const singnup = new Signup(accountDAO);
    const output = await singnup.execute(req.body);
    res.json(output);
})

app.get("/getAccount/:accountId", async (req, res) => {
    const accountDAO = new AccountDAODataBase();
    const getAccount = new GetAccount(accountDAO);
    const output = await getAccount.execute(req.params.accountId);
    res.json(output);
})

app.listen(3000);