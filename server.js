const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app= new Koa();

const tickets = [{id: 1, name: 'Серверная задача 1', status: true, created: '18/05/2021 13.15'}, {id: 2, name: 'Найти сотрудника', status: false, created: '18/05/2021 14.15'}];
const ticketsFull = [{id: 1, name: 'Серверная задача 1', description: 'eeddedeededededed', status: true, created: '18/05/2021 13.15'}, {id: 2, name: 'Найти сотрудника', description: 'eeddedeededededed', status: false, created: '18/05/2021 14.15'}]

function displayTime() {
    var str = "";

    let currentDate = new Date();
    let date = currentDate.getDate();
    let month = currentDate.getMonth()+1;
    let currentYear = date.toLocaleDateString('de-DE', {year: '2-digit'});
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

app.use(koaBody({urlencoded: true, multipart: true,}));

app.use(async ctx => {
    const { method } = ctx.request.query;
    const requestBody = ctx.request.body;

    ctx.response.set({'Access-Control-Allow-Origin':'*', 'permissions-policy': 'interest-cohort=()',});


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
            //let options = {day: 'numeric', month: 'numeric', year: '2-digit', hour: 'numeric', minute: 'numeric'};
            let newTicket = {
                id: tickets.length, 
                name: requestBody.short_description, 
                status: false, 
                created: displayTime(),
            };
            let newTicketFull = {
                id: ticketsFull.length, 
                name: requestBody.short_description, 
                description: requestBody.long_description, 
                status: false, 
                created: displayTime(),
            };
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