export class InMemoryDatabase {
	static #id = 1;
	#data = [];

	async insert(item) {
		const newItem = {...item, id: InMemoryDatabase.#id++};
		this.#data.push(newItem);
		return newItem;
	}

	async list() {
		return [...this.#data];
	}
}