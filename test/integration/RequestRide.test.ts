import Signup from '../../src/application/usecase/Signup';
import RequestRide from '../../src/application/usecase/RequestRide';
import GetRide from '../../src/application/usecase/GetRide';
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infrastructure/database/DatabaseConnection';
import { AccountRepositoryDataBase } from '../../src/infrastructure/repository/AccountRepository';
import { RideRepositoryDataBase } from '../../src/infrastructure/repository/RideRepository';
import { MailerGatewayConsole } from '../../src/infrastructure/gateway/MailerGateway';

let connection: DatabaseConnection;
let signup: Signup;
let getRide: GetRide;
let requestRide: RequestRide;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDataBase(connection);
    const rideRepository = new RideRepositoryDataBase(connection);
    signup = new Signup(accountRepository, new MailerGatewayConsole());
    requestRide = new RequestRide(rideRepository, accountRepository);
    getRide = new GetRide(rideRepository, accountRepository);
})

test("Deve solicitar uma corrida", async () => {
    const inputSignup = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "71428793860",
        isPassenger: true
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId, 
        fromLat: -27.584905257808835, 
        fromLong: -48.545022195325124, 
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.fromLat).toBe(-27.584905257808835);
    expect(outputGetRide.status).toBe("requested");
    expect(outputGetRide.date).toBeDefined();
});

afterEach(async () =>{
    await connection.close();
})