import { createServer } from "node:http";
import { UserController } from "./controller/index.js";
import { InMemoryDatabase } from "./infra/database/index.js";
import { UserService } from "./services/index.js";
import { Router } from "./utils/router.js";

const userRepository = new InMemoryDatabase();
const userService = new UserService({ userRepository });
const userController = new UserController({ userService });

const jsonMiddleware = async (req, res) => {
	const buffers = [];

	for await (const chunk of req) {
		buffers.push(chunk);
	}

	try {
		req.body = JSON.parse(Buffer.concat(buffers).toString());
	} catch (error) {
		req.body = null;
	}
}

const adaptRoute = async (controller) => {
	return async (req, res) => {
		const httpRequest = {
			body: req.body
		};

		const httpResponse = await controller.handle(httpRequest, res);
		httpResponse.build(res);
	}
}

const server = createServer(async (request, response) => {
	const router = new Router({ request, response });

	router.use(jsonMiddleware);

	router.get("/users", userController.list);
	router.post("/users", await adaptRoute(userController));
});

server.listen(3333, console.log("Server is running on http://localhost:3333"));