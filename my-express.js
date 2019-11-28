const http = require('http')
const fs = require('fs');
const LOCAL_DATABASE = 'students.json'
const url = require('url');





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
    // ---------------------------------------------------- FUNCTION GET-----------------------------------------------------

    get(path, callback) {
        this.app.on('request', (req, res) => {

            let pathname = this.getPathname(req)
            if (path == pathname && req.method == 'GET') {
                callback(req, res)
                res.end()
            }
            else if (path !== pathname && req.method == 'GET') {
                // res.write('Cannot GET ' + pathname)
                // res.end()
                console.log('Cannot GET ' + pathname)
            }
        })

    }
    // ---------------------------------------------------- FUNCTION POST-----------------------------------------------------

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

                    if (body != '') {

                        const user = JSON.parse(body)
                        let data = []

                        if (!fs.existsSync(LOCAL_DATABASE)) {
                            user.id = 1
                            data = [user]
                        } else {
                            const json = require(`./${LOCAL_DATABASE}`)
                            if (json != '') {
                                user.id = json[json.length - 1].id + 1
                            } else {
                                user.id = json.length + 1
                            }

                            json.push(user)
                            data = json
                        }

                        fs.writeFileSync(LOCAL_DATABASE, JSON.stringify(data, null, 4))
                        console.log("L'utilisateur avec l'id " + user.id + " a bien été crée")
                        callback(req, res)
                        res.end()
                    }
                    else {
                        console.log("Aucune insertion car le body est vide")
                    }
                })

            } else if (path !== pathname && req.method == 'POST') {
                // res.write('Cannot POST ' + pathname)
                // res.end()
                console.log('Cannot POST ' + pathname)
            }
        })
    }

    // ---------------------------------------------------- FUNCTION PUT-----------------------------------------------------

    put(path, callback) {

        this.app.on('request', (req, res) => {

            let pathname = this.getPathname(req)
            let splitPathname = pathname.split('/')
            let putId = splitPathname[splitPathname.length - 1]
            let matchPut = []
            let json = ""
            let data = ''
            let isExist = false


            if (path == pathname && req.method == 'PUT') {

                req.on('data', chunk => {
                    data += chunk.toString()
                })

                req.on('end', () => {

                    if (data != '') {
                        let putData = JSON.parse(data)
                        const { name, school } = putData
                        matchPut = putId.match(/(^[0-9]+$)/g) // ON VERIFIE SI ON MATCH AVEC UN NOMBRE


                        if (matchPut != null) {// ON VERIFIE SI IL Y UN NOMBRE
                            putId = parseInt(matchPut[0])
                            if (fs.existsSync(LOCAL_DATABASE)) {
                                json = require(`./${LOCAL_DATABASE}`) //on lit et parse en string
                                //ON VERIFIE SI L'ID EXISTE
                                for (const k in json) {
                                    if (json[k].id == putId) {
                                        isExist = true
                                    }
                                }
                                // SI IL EXISTE ON CHERCHE LA LIGNE A MODIFIER
                                if (isExist == true) {
                                    for (const key in json) {
                                        if (json[key].id == putId) {
                                            if (name != undefined) {
                                                json[key].name = name
                                            }
                                            if (school != undefined) {
                                                json[key].school = school
                                            }
                                            fs.writeFileSync(LOCAL_DATABASE, JSON.stringify(json, null, 4))
                                            console.log("La modification a bien été aplliqué")
                                        }
                                    }
                                } else {
                                    console.log(` L'id ${putId} n'existe pas dans le fichier ${LOCAL_DATABASE}`)
                                }

                            } else {
                                console.log(` Le fichier ${LOCAL_DATABASE} ne peut pas etre modifié si il n'existe pas`)
                            }
                        } else {
                            console.log("L'id renseigné n'est pas un nombre ")

                        }
                        callback(req, res)
                        res.end()
                    }
                    else {
                        console.log("Aucune insertion car le body est vide")
                    }

                })

            }
            else if (path !== pathname && req.method == 'PUT') {
                // res.write('Cannot PUT ' + pathname)
                // res.end()
                console.log('Cannot PUT ' + pathname)

            }
        })

    }

    // ---------------------------------------------------- FUNCTION DELETE-----------------------------------------------------

    delete(path, callback) {

        this.app.on('request', (req, res) => {

            let pathname = this.getPathname(req)
            let splitPathname = pathname.split('/')
            let matchDelete = []
            let json = ""
            let globalJson = []
            let isExist = false

            if (path == pathname && req.method == 'DELETE') {
                if (path == '/') {
                    fs.writeFileSync(LOCAL_DATABASE, JSON.stringify([], null, 4))
                    callback(req, res)
                    res.end()
                    console.log("Vous avez supprimé tout les étudiants")
                } else {

                    let deleteId = splitPathname[splitPathname.length - 1]
                    matchDelete = deleteId.match(/(^[0-9]+$)/g) // ON VERIFIE SI ON MATCH AVEC UN NOMBRE

                    if (matchDelete != null) { // ON VERIFIE SI IL Y UN NOMBRE
                        deleteId = parseInt(matchDelete[0])
                        if (fs.existsSync(LOCAL_DATABASE)) {
                            json = require(`./${LOCAL_DATABASE}`) //on lit et parse en string
                            //ON VERIFIE SI L'ID EXISTE
                            for (const k in json) {
                                if (json[k].id == deleteId) {
                                    isExist = true
                                }
                            }
                            // SI IL EXISTE ON VA CHERCHE LA LIGNE A SUPPRIMER
                            if (isExist == true) {
                                for (const key in json) {
                                    if (json[key].id != deleteId) {
                                        globalJson.push(json[key]) // ON AJOUTE TOUT LES OBJECTS QUI N'ONT PAS L'ID MENTIONNE
                                        fs.writeFileSync(LOCAL_DATABASE, JSON.stringify(globalJson, null, 4))
                                    }
                                }
                                console.log("l'objet avec l'id " + deleteId + " a été supprimé")
                            } else {
                                console.log("l'id " + deleteId + " n'existe pas")
                            }
                        } else {
                            console.log(` le fichier ${LOCAL_DATABASE} ne peut pas etre modifié si il n'existe pas`)
                        }
                    } else {
                        console.log("l'id renseigné n'est pas un nombre ")
                    }
                    callback(req, res)
                    res.end()
                }

            }

            else if (pathname != path && req.method == 'DELETE') {
                // res.write('Cannot DELETE ' + pathname)
                // res.end()
                console.log('Cannot DELETE ' + pathname)

            }

        })

    }

    // ---------------------------------------------------- FUNCTION ALL-----------------------------------------------------

    all() { }

    // ---------------------------------------------------- FUNCTION LISTEN-----------------------------------------------------

    listen(port, callback) {
        if (typeof port == 'number') {
            this.app.listen(port)
            callback()
        } else {
            console.log("le port n'est pas un nombre")
        }

    }

    // ---------------------------------------------------- FUNCTION RENDER-----------------------------------------------------
  
    render(...args) {

        let regex = /({{[\w]+}})/g;
        let file = args[0]
        let filename = file + '.mustache'
        let content = ''
        let fn = ''
        let obj = {}

        if (args.length == 3) {
            fn = args[args.length - 1]
            obj = args[args.length - 2]
        } else {
            fn = args[args.length - 1]
        }

        if (!fs.existsSync(filename)) {
            console.log(`The file ${filename} does not exist.`);
        }
        else {

            const rstream = fs.createReadStream(file + '.mustache') //lecture du fichier 
            rstream.on('data', chunk => {
                content = chunk.toString()
                fn(null, content)
            })

            rstream.on("end", () => {

                if (args.length == 3) {

                    let matchKey = content.match(regex)
                    if (matchKey != null) {
                        for (const key in matchKey) {

                            let keyObject = matchKey[key].replace(/({|})/g, '')
                            if (obj[keyObject] != undefined) {
                                content = content.replace(matchKey[key], obj[keyObject])
                            }
                        }
                    }

                    fs.writeFile(filename, content, (err) => {
                        if (err) throw err;
                    });
                }

            })

        }
    }
}

function express() {
    return new myExpress()
}


module.exports = express

