const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app= new Koa();

let tickets = [
    {id: '_678iuy', name: 'Серверная задача 1', status: "true", created: '18.05.2021 13.15'}, 
    {id: '_u1234nh', name: 'Найти сотрудника', status: "false", created: '18.05.2021 14.15'}
];

let ticketsFull = [
    {id: '_678iuy', name: 'Серверная задача 1', description: 'eeddedeededededed', status: "true", created: '18.05.2021 13.15'}, 
    {id: '_u1234nh', name: 'Найти сотрудника', description: 'eeddedeededededed', status: "false", created: '18.05.2021 14.15'}
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

function getRandomId() {
    return '_' + Math.random().toString(36).substr(2, 9);
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
            if(requestBody.id === 'null'){
                let newTicket = {
                    id: getRandomId(), 
                    name: requestBody.short_description, 
                    status: requestBody.status, 
                    created: displayTime(),
                };
                let newTicketFull = {
                    id: newTicket.id, 
                    name: requestBody.short_description, 
                    description: requestBody.long_description, 
                    status: requestBody.status, 
                    created: displayTime(),
                };
                tickets.push(newTicket);
                ticketsFull.push(newTicketFull);
            } else {
                //console.log('type',typeof(requestBody.id));
                let idValue = requestBody.id;
                //console.log('type',typeof(idValue));
                tickets = tickets.map((ticket) => {
                    console.log(ticket.id);
                    if(ticket.id === idValue) {
                        return { id: idValue, name: requestBody.short_description, status: requestBody.status, created: displayTime()};
                    } else {
                        return ticket
                    }
                });
                ticketsFull = ticketsFull.map((ticket) => {
                    if(ticket.id === idValue) {
                        return { id: idValue, name: requestBody.short_description, description: requestBody.long_description, status: requestBody.status, created: displayTime()};
                    } else {
                        return ticket
                    }
                });
                //console.log('!!!!!!',tickets, ticketsFull);
                
            }
            ctx.response.body = 'OK';
            return
        case 'ticketById':
            let { id } = ctx.request.query;
            let ticket = findTicketById(id);
            ctx.response.body = JSON.stringify(ticket);
            return
        case 'deleteTicketById':
            let { deleteId } = ctx.request.query;
            console.log(deleteId);
            //let ticketForDeletion = findTicketById(deleteId);
            for (let i=0; i<tickets.length; i++) {
                if(tickets[i].id === deleteId) {
                    tickets.splice(i,1);
                    ticketsFull.splice(i,1);
                }
            }
            ctx.response.body = 'OK';
            return
        case 'showTicketDescription':
            let { descriptionId } = ctx.request.query;
            console.log('descriptionTicketId',descriptionId);
            tickets = tickets.map((ticket, index) => {
                console.log('index',index);
                if(ticket.id === descriptionTicketId) {
                    return ticketsFull[index];
                } else {
                    return ticket
                }
            });
            ctx.response.body = tickets;
            return
        default:
            ctx.response.status = 404;
            return;
    }
});


const port = process.env.PORT||7070;
const server = http.createServer(app.callback()).listen(port);