import jwt from "jsonwebtoken"

export const auth = (request, response, next) =>{
    try{
        const token = request.header("x-auth-token")
        jwt.verify(token, process.env.SECRET_KEY, (err,user)=>{
            if(err){
                return response.status(403).send({msg:"invalid token"})
            }
            request.user = user
            next()
        })
        
    }catch(err){
        response.status(401).send({error:err.message})
    }
}

export const authAndVerifyUser = (request, response, next)=>{
    auth(request, response, ()=>{
        if(request.user.role !== "user"){
            response.status(401).send({msg:"user access denied"})
        }else{
            next()
        }
    })
}

export const authAndVerifyAdmin = (request, response, next)=>{
    auth(request, response, ()=>{
        if(request.user.role !== "admin"){
            response.status(401).send({msg:"admin access denied"})
        }else{
            next()
        }
    })
}