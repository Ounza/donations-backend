import { ObjectId } from "mongodb"
import {client} from "./index.js"
import bcrypt from "bcrypt"

async function createNgo(ngo){
    return await client.db("charity-donations").collection("ngos").insertOne(ngo)
}

async function getAllNgos(){
    return await client.db("charity-donations").collection("ngos").find({}).toArray()
}

async function getNgoById(id){
    return await client.db("charity-donations").collection("ngos").findOne({_id:ObjectId(id)})
}

async function createCategories(category){
    return await client.db("charity-donations").collection("categories").insertOne(category)
}

async function addProducts(data){
    return await client.db("charity-donations").collection("products").insertOne(data)
}

async function deleteProduct(id){
    return await client.db("charity-donations").collection("products").deleteOne({_id:ObjectId(id)})
}

async function addExtras(data){
    return await client.db("charity-donations").collection("extras").insertOne(data)
}

async function setDeliveryMethods(data){
    return await client.db("charity-donations").collection("deliveryMethods").insertOne(data)
}


async function getAllCategoriesForNgo(id){
    return await client.db("charity-donations").collection("categories").find({ngoId:id}).toArray()
}

async function getAllProductsForCategory(id){
    return await client.db("charity-donations").collection("products").find({catId:id}).toArray()
}

async function getAllProductsByNgo(id){
    // return await client.db("charity-donations").collection("products").find({ngoId:id}).toArray()
    return await client.db("charity-donations").collection("products").aggregate([
        {
            $match:{
                ngoId:id
            }
        },
        {
            $group:{
                "_id":"$catId",
                "catName":{"$first":"$catName"},
                "ngoName":{"$first":"$ngoName"},
                "products":{
                    $push:{
                        "_id":"$_id",
                        "name":"$name",
                        "rate":"$rate",
                        "catId":"$catId",
                        "catName":"$catName",
                        "ngoId":"$ngoId",
                        "ngoName":"$ngoName"
                    }
                }
            }
        }
    ]).toArray()
}

async function getProductById(id){
    return await client.db("charity-donations").collection("products").findOne({_id:ObjectId(id)})
}

async function updateProductById(id, data){
    return await client.db("charity-donations").collection("products").updateOne({_id:ObjectId(id)},{$set:{name:data.name, rate:data.rate}})
}

async function getExtras(){
    return await client.db("charity-donations").collection("extras").find({}).toArray()
}

async function getDeliveryMethods(){
    return await client.db("charity-donations").collection("deliveryMethods").find({}).toArray()
}

async function placeOrder(order) {
    return await client.db("charity-donations").collection("orders").insertOne(order);
}

async function cancelRequest(id){
    return await client.db("charity-donations").collection("orders").deleteOne({"_id":ObjectId(id)})
}

async function getOrderDetailById(id){
    return await client.db("charity-donations").collection("orders").findOne({"_id":ObjectId(id)})
}

async function userGetOrders(userId){
    return await client.db("charity-donations").collection("orders").find({userId: userId}).sort({orderedAt: -1}).toArray()
}

async function getAllOrders(){
    return await client.db("charity-donations").collection("orders").find({}).sort({orderedAt: -1}).toArray()
}

async function getNewOrders(){
    return await client.db("charity-donations").collection("orders").find({orderStatus:{$in:["pickup requested", "donations pickedup"]}}).sort({orderedAt: -1}).toArray()
}

async function getOnProgressOrders(){
    return await client.db("charity-donations").collection("orders").find({orderStatus:{$in:["in progress", "completed"]}}).toArray()
}

async function getCompletedOrders(){
    return await client.db("charity-donations").collection("orders").find({orderStatus: "delivered"}).toArray()
}

async function updateOrderStatus(id, stage){
    return await client.db("charity-donations").collection("orders").updateOne({"_id":ObjectId(id), "statusArray.stage":stage}, {$set:{"statusArray.$.isCompleted":"true", "statusArray.$.updatedAt":new Date().toISOString(), "orderStatus":stage, "orderUpdatedAt": new Date()}},{upsert:true})
}

async function getUserByEmail(email){
    return await client.db("charity-donations").collection("users").findOne({email:email})
}

async function getUserById(userId){
    return await client.db("charity-donations").collection("users").findOne({_id:ObjectId(userId)})
}

async function genPassword(password){
    const NO_OF_ROUNDS = 10
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS)
    
    const hashedPassword = await bcrypt.hash(password, salt)
    
    return hashedPassword
}

async function createUser(data) {
    return await client.db("charity-donations").collection("users").insertOne(data);
}

export {createNgo, createCategories, addProducts, addExtras, setDeliveryMethods, getAllNgos, getAllCategoriesForNgo, getAllProductsForCategory, getExtras, getDeliveryMethods, getAllProductsByNgo, getUserByEmail, genPassword, createUser, getUserById, getNgoById, placeOrder, getOrderDetailById, userGetOrders, getProductById, updateProductById, deleteProduct, getAllOrders, getNewOrders, getOnProgressOrders, getCompletedOrders, updateOrderStatus, cancelRequest}