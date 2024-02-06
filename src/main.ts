import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import RequestRide from "./application/usecase/RequestRide";
import GetRide from "./application/usecase/GetRide";
import { RideRepositoryDataBase } from "./infrastructure/repository/RideRepository";
import { AccountRepositoryDataBase } from "./infrastructure/repository/AccountRepository";
import { MailerGatewayConsole } from "./infrastructure/gateway/MailerGateway";
import { PgPromiseAdapter } from "./infrastructure/database/DatabaseConnection";
import { ExpressAdapter } from "./infrastructure/http/HttpServer";
import MainController from "./infrastructure/http/MainController";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDataBase(connection);
const rideRepository = new RideRepositoryDataBase(connection);
const mailerGateway = new MailerGatewayConsole();
const signup = new Signup(accountRepository, mailerGateway);
const getAccount = new GetAccount(accountRepository);
const requestRide = new RequestRide(rideRepository, accountRepository);
const getRide = new GetRide(rideRepository, accountRepository);
new MainController(httpServer, signup, getAccount, requestRide, getRide);

httpServer.listen(3000);