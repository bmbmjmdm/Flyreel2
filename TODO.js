class TODO {
    constructor(due, title, desc) {
        this.due = due;
        this.complete = false;
		this.title = title;
		this.desc = desc;
		this.id = idCounter++;
    }
}

idCounter = 0;

module.exports = TODO;