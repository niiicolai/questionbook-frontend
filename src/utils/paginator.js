

export default class Paginator {
    constructor(options={}) {
        if (!options.page) throw new Error('Page is required');
        if (!options.limit) throw new Error('Limit is required');
        if (options.page < 1) throw new Error('Page must be greater than 0');
        if (options.limit < 1) throw new Error('Limit must be greater than 0');
        if (typeof options.requestMethod !== 'function') throw new Error('Request method must be a function');

        this.page = options.page;
        this.limit = options.limit;
        this.requestMethod = options.requestMethod;
        this.rows = [];
        this.count = 0;
        this.pages = 0;
    }

    async next() {
        if (this.page >= this.pages) return;

        this.page++;
        await this.fetch();
    }

    async previous() {
        if (this.page <= 1) return;

        this.page--;
        await this.fetch();
    }

    async first() {
        if (this.page === 1) return;

        this.page = 1;
        await this.fetch();
    }

    async last() {
        if (this.page === this.pages) return;

        this.page = this.pages;
        await this.fetch();
    }

    async goTo(page) {
        if (page < 1 || page > this.pages) return;

        this.page = page;
        await this.fetch();
    }

    async fetch() {
        const { rows, count, pages} = await this.requestMethod({ page: this.page, limit: this.limit });
        this.rows = rows;
        this.count = count;
        this.pages = pages;
    }
}
