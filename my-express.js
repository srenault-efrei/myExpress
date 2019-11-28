
const http = require('http')
const fs = require('fs');
const LOCAL_DATABASE = 'students.json'
const url = require('url');
const { Transform } = require('stream')





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

            let pathname = this.getPathname(req)
            if (path == pathname && req.method == 'GET') {
                callback(req, res)
                res.end()

            } else if (path !== pathname && req.method == 'GET') {
                res.write('Cannot GET ' + pathname)
                res.end()
            }

        })

    }
    // verifier quand on supprime un user et qu'on ajoute un nouveau user l'id soit unique
    // verfier si  le body n'est pas vide
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

            } else if (path !== pathname && req.method == 'POST') {
                res.write('Cannot POST ' + pathname)
                res.end()
            }
        })
    }

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
                })

            }
            else if (path !== pathname && req.method == 'PUT') {
                res.write('Cannot PUT ' + pathname)
                res.end()
            }
        })

    }

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
                res.write('Cannot DELETE ' + pathname)
                res.end()
            }

        })

    }

    all() {

    }
    listen(port, callback) {
        if (typeof port == 'number') {
            this.app.listen(port)
            callback()
        } else {
            console.log("le port n'est pas un nombre")
        }

    }

    render(file, obj, fn) {
        let regex = /({{[\w]+}})/g;
        let filename = file + '.mustache'
        let content = ''
        if (!fs.existsSync(filename)) {
            console.log(`The file ${filename} does not exist.`);
        } else {
            const rstream = fs.createReadStream(file + '.mustache') //lecture du fichier 

            rstream.on('data', chunk => {
                content = chunk.toString()
                fn(null, content)
            })

            const wstream = fs.createWriteStream('homeBis.mustache')
            const tstream = new Transform({
                transform(chunk, encoding, callback) {

                    rstream.on("end", () => {

                        let matchKey = content.match(regex)
                        let keyObject = matchKey[0].replace(/({|})/g, '')
                        console.log(matchKey[0])
                        this.push(chunk.toString().replace(matchKey[0], obj[keyObject]))
                        //this.push(chunk.toString().replace(/Hello/g, 'hii'))

                        callback()
                    })
                }
            })
            rstream.pipe(tstream).pipe(wstream)
        }

    }
}

function express() {
    return new myExpress()
}


module.exports = express

