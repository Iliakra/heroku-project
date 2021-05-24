const http = require('http');
const Koa = require('koa');
const app= new Koa();

const tickets = [{id: 1, name: 'Поменять краску в принтере', status: true, created: '18/05/2021 13.15'}, {id: 2, name: 'Найти сотрудника', status: false, created: '18/05/2021 14.15'}];
const ticketsFull = [{id: 1, name: 'Поменять краску в принтере', description: 'eeddedeededededed', status: true, created: '18/05/2021 13.15'}, {id: 2, name: 'Найти сотрудника', description: 'eeddedeededededed', status: false, created: '18/05/2021 14.15'}]

app.use(async ctx => {
    const { method } = ctx.request.query;

    ctx.response.set({'Access-Control-Allow-Origin':'*',});

    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        case 'ticketById':
            ctx.response.body = ticketsFull;
            return;
        default:
            ctx.response.status = 404;
            return;
    }

});


const port = process.env.PORT||7070;
const server = http.createServer(app.callback()).listen(port);