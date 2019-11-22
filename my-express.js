
const http = require('http')
const url = require('url');

class myExpress{

    constructor(){
      
      this.init()
      this.app = this.init()

    }
   
   init(){
 
    const server  =  http.createServer()
          return server

    }


    get(path,fn){
        this.app.on('request', (req,res)=>{
            fn(req,res)
            res.end()
           
        })

    }   

    post(){

    }   

    put(){

    }

    delete(){

    }

    all(){

    }
    listen(port){

     if(typeof port == 'number'){
        this.app.listen(port)
     }else{
         console.log("le port n'est pas un nombre")
     }
      
    }

    render(){

    }
}

function express(){
    return new myExpress()
}


module.exports = express

