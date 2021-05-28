const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app= new Koa();

const tickets = [
    {id: 1, name: 'Серверная задача 1', status: "true", created: '18.05.2021 13.15'}, 
    {id: 2, name: 'Найти сотрудника', status: "false", created: '18.05.2021 14.15'}
];

const ticketsFull = [
    {id: 1, name: 'Серверная задача 1', description: 'eeddedeededededed', status: "true", created: '18.05.2021 13.15'}, 
    {id: 2, name: 'Найти сотрудника', description: 'eeddedeededededed', status: "false", created: '18.05.2021 14.15'}
]

function displayTime() {
    var str = "";

    let currentDate = new Date();
    let date = currentDate.getDate();
    let month = currentDate.getMonth()+1;
    let currentYear = currentDate.getFullYear();
    let hour = currentDate.getHours()+3;
    let minutes = currentDate.getMinutes();

    if (date < 10) {
        date = "0" + date
    }
    if (month < 10) {
        month = "0" + month
    }
    if (hour < 10) {
        hour = "0" + hour
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }

    str += date + "." + month + "." + currentYear + " " + hour + ':' + minutes;
    return str;
}

function findTicketById (reqId) {
    for (let i=0; i<ticketsFull.length; i++) {
        if (ticketsFull[i].id === reqId) {
            requestedTicket = ticketsFull[i];
            return requestedTicket;
        }
    }
}

app.use(koaBody({urlencoded: true, multipart: true,}));

app.use(async ctx => {
    console.log('ctx.request.query',ctx.request.query);
    const { method } = ctx.request.query;

    ctx.response.set({'Access-Control-Allow-Origin':'*',});


    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        case 'createTicket':
            let requestBody = ctx.request.body;
            console.log('reqBode', requestBody);
            let newTicket = {
                id: tickets.length+1, 
                name: requestBody.short_description, 
                status: requestBody.status, 
                created: displayTime(),
            };
            let newTicketFull = {
                id: ticketsFull.length+1, 
                name: requestBody.short_description, 
                description: requestBody.long_description, 
                status: requestBody.status, 
                created: displayTime(),
            };
            tickets.push(newTicket);
            ticketsFull.push(newTicketFull);
            ctx.response.body = 'OK';
            return
        case 'ticketById':
            const { id } = ctx.request.query;
            let ticket = findTicketById(Number(id));
            ctx.response.body = JSON.stringify(ticket);
            return
        default:
            ctx.response.status = 404;
            return;
    }

});


const port = process.env.PORT||7070;
const server = http.createServer(app.callback()).listen(port);