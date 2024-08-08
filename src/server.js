import { createServer } from "node:http";
import { UserController } from "./controller/index.js";
import { InMemoryDatabase } from "./infra/database/index.js";
import { UserService } from "./services/index.js";
import { Router } from "./utils/router.js";

const userRepository = new InMemoryDatabase();
const userService = new UserService({ userRepository });
const userController = new UserController({ userService });

const server = createServer((request, response) => {
	const router = new Router({ request, response });

	router.get("/users", userController.list.bind(userController));
	router.post("/users", userController.create.bind(userController));
});

server.listen(3333, console.log("Server is running on http://localhost:3333"));