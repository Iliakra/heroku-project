const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app= new Koa();

const tickets = [{id: 1, name: 'Серверная задача 1', status: true, created: '18/05/2021 13.15'}, {id: 2, name: 'Найти сотрудника', status: false, created: '18/05/2021 14.15'}];
const ticketsFull = [{id: 1, name: 'Серверная задача 1', description: 'eeddedeededededed', status: true, created: '18/05/2021 13.15'}, {id: 2, name: 'Найти сотрудника', description: 'eeddedeededededed', status: false, created: '18/05/2021 14.15'}]

app.use(koaBody({urlencoded:true,}));

app.use(async ctx => {
    const { method } = ctx.request.query;
    const requestBody = ctx.request.body;

    ctx.response.set({'Access-Control-Allow-Origin':'*',});

    if (method) {
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
    }

    ctx.response.body = requestBody;

});


const port = process.env.PORT||7070;
const server = http.createServer(app.callback()).listen(port);