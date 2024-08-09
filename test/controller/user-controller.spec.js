import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { UserController } from "../../src/controller/index.js";

const makeUserServiceStub = () => {
	class UserServiceStub {
		async create({ name }) {
			return { id: 1, name: "Fulano" }
		}
	}

	return new UserServiceStub();
}

const makeSut = () => {
	const userServiceStub = makeUserServiceStub();
	const sut = new UserController({ userService: userServiceStub });

	return {
		sut,
		userServiceStub
	}
}

describe("UserController", () => {
	it("Should call UserService with correct value", async () => {
		const { sut, userServiceStub } = makeSut();

		const httpRequest = {
			body: { name: "Fulano" }
		};

		mock.method(userServiceStub, "create");

		await sut.handle(httpRequest);

		const calls = userServiceStub.create.mock.calls[0];

		assert.deepEqual(calls.arguments, [{ name: "Fulano" }]);
	});

})