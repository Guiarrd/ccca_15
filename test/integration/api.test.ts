import axios from "axios";

axios.defaults.validateStatus = () => {
    return true;
}

test("Deve criar a conta do motorista", async () => {
    const input = {
        name: "Fulano da Silva",
        email: `fulano${Math.random()}@uber-fake.com`,
        cpf: "97456321558",
        carPlate: "ABC1234",
        isDriver: true
    }

    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(`http://localhost:3000/getAccount/${outputSignup.accountId}`)
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.carPlate).toBe(input.carPlate);
    expect(outputGetAccount.isDriver).toBe(input.isDriver);
});

test("Deve criar a conta do passageiro", async () => {
    const input = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "71428793860",
        isPassenger: true
    }

    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(`http://localhost:3000/getAccount/${outputSignup.accountId}`)
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);

});

test("Deve solicitar uma corrida", async () => {
    const inputSignup = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "71428793860",
        isPassenger: true
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const inputRequestRide = {
        passengerId: outputSignup.accountId, 
        fromLat: -27.584905257808835, 
        fromLong: -48.545022195325124, 
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const outputRequestRide = responseRequestRide.data;
    
    expect(outputRequestRide.rideId).toBeDefined();
    const responseGetRide = await axios.get(`http://localhost:3000/rides/${outputRequestRide.rideId}`);
    const outputGetRide = responseGetRide.data;
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.fromLat).toBe(-27.584905257808835);
    expect(outputGetRide.status).toBe("requested");
    expect(outputGetRide.date).toBeDefined();
});

test("Não deve solicitar uma corrida se a conta não for de um passageiro", async () => {
    const inputSignup = {
        name: "Fulano da Silva",
        email: `fulano${Math.random()}@uber-fake.com`,
        cpf: "97456321558",
        carPlate: "ABC1234",
        isDriver: true
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const inputRequestRide = {
        passengerId: outputSignup.accountId, 
        from_lat: -27.584905257808835, 
        from_long: -48.545022195325124, 
        to_lat: -27.496887588317275,
        to_long: -48.522234807851476
    }
    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const outputRequestRide = responseRequestRide.data;
    expect(responseRequestRide.status).toBe(422);
    expect(outputRequestRide.message).toBe("Cannot request a ride for drivers.")
})

test("Não deve solicitar uma corrida se o passageiro tiver outra corrida ativa", async () => {
    const inputSignup = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "71428793860",
        isPassenger: true
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const inputRequestRide = {
        passengerId: outputSignup.accountId, 
        from_lat: -27.584905257808835, 
        from_long: -48.545022195325124, 
        to_lat: -27.496887588317275,
        to_long: -48.522234807851476
    }
    
    await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const outputRequestRide = responseRequestRide.data;
    expect(responseRequestRide.status).toBe(422);
    expect(outputRequestRide.message).toBe("Cannot request a ride for passengers with unfinished rides.")
})