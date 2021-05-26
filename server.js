const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app= new Koa();

const tickets = [{id: 1, name: 'Серверная задача 1', status: true, created: '18/05/2021 13.15'}, {id: 2, name: 'Найти сотрудника', status: false, created: '18/05/2021 14.15'}];
const ticketsFull = [{id: 1, name: 'Серверная задача 1', description: 'eeddedeededededed', status: true, created: '18/05/2021 13.15'}, {id: 2, name: 'Найти сотрудника', description: 'eeddedeededededed', status: false, created: '18/05/2021 14.15'}]

app.use(koaBody({urlencoded: true, multipart: true,}));

app.use(async ctx => {
    const { method } = ctx.request.query;
    const requestBody = ctx.request.body;

    ctx.response.set({'Access-Control-Allow-Origin':'*',});

    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        case 'ticketById':
            ctx.response.body = ticketsFull;
            return;
        case 'createTicket':
            let requestBody = ctx.request.body;
            let date = new Date();
            let newTicket = {id: tickets.length, name: requestBody.short_description, status: false, created: `${date.getDate()}.${date.getMonth()}.${date.getYear()}  ${date.getHours}:${date.getMinutes}`};
            let newTicketFull = {id: ticketsFull.length, name: requestBody.short_description, description: requestBody.long_description, status: false, created: `${date.getDate()}.${date.getMonth()}.${date.getYear()}  ${date.getHours}:${date.getMinutes}`};
            tickets.push(newTicket);
            ticketsFull.push(newTicketFull);
            ctx.response.body = 'OK';
            return
        default:
            ctx.response.status = 404;
            return;
    }

});


const port = process.env.PORT||7070;
const server = http.createServer(app.callback()).listen(port);