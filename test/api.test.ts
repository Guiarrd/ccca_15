import axios from "axios";

test.skip("Deve criar a conta do motorista", async () => {
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
    expect(outputGetAccount.car_plate).toBe(input.carPlate);
    expect(outputGetAccount.is_driver).toBe(input.isDriver);
});