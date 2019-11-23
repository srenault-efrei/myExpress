
const http = require('http')
const url = require('url');
const fs = require('fs');
const LOCAL_DATABASE = 'students.json'


class myExpress {

    constructor() {

        this.app = this.init()

    }

    init() {

        const server = http.createServer()
        return server

    }

    getPathname(req) {
        const request_url = req.url;
        const { pathname } = url.parse(request_url, true)
        return pathname
    }
    getQuery(req) {
        const request_url = req.url;
        const { query } = url.parse(request_url, true)
        return query
    }

    get(path, callback) {
        this.app.on('request', (req, res) => {

            res.writeHead(200, { 'Content-Type': 'text/html' });
            let pathname = this.getPathname(req)
            let query = this.getQuery(req)

            // if (query != null) {
            //     name = query.name
            // }
            if (path == pathname && req.method == 'GET') {
                callback(req, res)
                res.end()
            }
        })

    }
// verifier quand on supprime un user et qu'on ajoute un nouveau user l'id soit unique
    post(path, callback, ) {
        this.app.on('request', (req, res) => {

            res.writeHead(200, { 'Content-Type': 'text/html' });
            let pathname = this.getPathname(req)
            let body = ''

            if (path == pathname && req.method == 'POST') {
                req.on('data', chunk => {
                    body += chunk.toString()
                })

                req.on('end', () => {
                    const user = JSON.parse(body)
                    let data = []

                    if (!fs.existsSync(LOCAL_DATABASE)) {
                        user.id = 1
                        data = [user]
                    } else {
                        const json = require(`./${LOCAL_DATABASE}`) 
                        user.id = json.length + 1
                        json.push(user)
                        data = json
                    }

                    fs.writeFileSync(LOCAL_DATABASE, JSON.stringify(data, null, 4))
                    console.log("L'utilisateur avec l'id " + user.id + " a bien été crée")
                    callback(req, res)
                    res.end()

                })
             
            }
        })
    }

    put() {

    }

    delete() {

    }

    all() {

    }
    listen(port) {
    // Recuperer le port en ligne de commande
        if (typeof port == 'number') {
            this.app.listen(port)
        } else {
            console.log("le port n'est pas un nombre")
        }

    }

    render() {

    }
}

function express() {
    return new myExpress()
}


module.exports = express

