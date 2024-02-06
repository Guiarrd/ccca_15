import AcceptRide from "../../src/application/usecase/AcceptRide";
import { AccountRepositoryDataBase } from "../../src/infrastructure/repository/AccountRepository";
import { RideRepositoryDataBase } from "../../src/infrastructure/repository/RideRepository";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infrastructure/database/DatabaseConnection";
import Signup from "../../src/application/usecase/Signup";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import { MailerGatewayConsole } from "../../src/infrastructure/gateway/MailerGateway";

let connection: DatabaseConnection;
let signup: Signup;
let getRide: GetRide;
let requestRide: RequestRide;
let acceptRide: AcceptRide;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDataBase(connection);
    const rideRepository = new RideRepositoryDataBase(connection);
    signup = new Signup(accountRepository, new MailerGatewayConsole());
    requestRide = new RequestRide(rideRepository, accountRepository);
    acceptRide = new AcceptRide(accountRepository, rideRepository);
    getRide = new GetRide(rideRepository, accountRepository);
})

test("Deve aceitar uma corrida", async () => {
    const inputSignupPassenger = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "71428793860",
        isPassenger: true
    }
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId, 
        fromLat: -27.584905257808835, 
        fromLong: -48.545022195325124, 
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputSignupDriver = {
        name: "Fulano da Silva",
        email: `fulano${Math.random()}@uber-fake.com`,
        cpf: "97456321558",
        carPlate: "ABC1234",
        isDriver: true
    }
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId
    }
    await acceptRide.execute(inputAcceptRide);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.driverId).toBe(inputAcceptRide.driverId);
    expect(outputGetRide.status).toBe("accepted");
});

afterEach(async () =>{
    await connection.close();
})