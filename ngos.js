import express, { response } from "express"
import { authAndVerifyAdmin } from "./customauth.js"
import { createNgo, createCategories, addProducts, addExtras, setDeliveryMethods, getAllNgos, getAllCategoriesForNgo, getAllProductsForCategory, getExtras, getDeliveryMethods, getAllProductsByNgo, getNgoById, getProductById, updateProductById, deleteProduct} from "./helper.js"
const router = express.Router()

router.route("/createNgo")
.post(async (request, response)=>{
    console.log(request.body)
    const data = await createNgo(request.body)
    response.send(data)
})

router.route("/getAllNgos")
.get(async (request, response)=>{
    const data = await getAllNgos()
    response.send(data)
})

router.route("/adminGetAllServices")
.get(authAndVerifyAdmin, async(request, response)=>{
    const data = await getAllNgos()
    response.send(data)
})

router.route("/getNgoById/:id")
.get(async (request, response)=>{
    const {id} = request.params
    const data = await getNgoById(id)
    response.send(data)
})

router.route("/adminGetServiceById/:id")
.get(authAndVerifyAdmin, async (request, response)=>{
    const {id} = request.params
    const data = await getNgoById(id)
    response.send(data)
})

router.route("/createCategories")
.post(async (request, response)=>{
    console.log(request.body)
    const data = await createCategories(request.body)
    response.send(data)
})

router.route("/getAllCategoriesForNgo/:id")
.get(async (request, response)=>{
    const {id} = request.params
    const data = await getAllCategoriesForNgo(id)
    response.send(data)
})

router.route("/adminGetAllCategoriesForNgo/:id")
.get(authAndVerifyAdmin, async (request, response)=>{
    const {id} = request.params
    const data = await getAllCategoriesForNgo(id)
    response.send(data)
})

router.route("/addProducts")
.post(authAndVerifyAdmin, async (request, response)=>{
    const data = await addProducts({...request.body, rate:parseFloat(request.body.rate)})
    response.send(data)
})

router.route("/adminDeleteProduct/:id")
.delete(authAndVerifyAdmin, async(request, response)=>{
    const {id} = request.params
    const data = await deleteProduct(id)
    response.send(data)
})

router.route("/getAllProductsForCategory/:id")
.get(async (request, response)=>{
    const {id} = request.params
    const data = await getAllProductsForCategory(id)
    response.send(data)
})

router.route("/adminGetAllProductsForCategory/:id")
.get(authAndVerifyAdmin, async (request, response)=>{
    const {id} = request.params
    const data = await getAllProductsForCategory(id)
    response.send(data)
})

router.route("/getAllProductsByNgo/:id")
.get(async (request, response)=>{
    const {id} = request.params
    const data = await getAllProductsByNgo(id)
    response.send(data)
})

router.route("/adminGetProductById/:id")
.get(authAndVerifyAdmin, async(request, response)=>{
    const {id} = request.params
    const data = await getProductById(id)
    response.send(data)
})

router.route("/adminUpdateProductById/:id")
.put(authAndVerifyAdmin, async(request, response)=>{
    const {id} = request.params
    const data = await updateProductById(id, {...request.body, rate:parseFloat(request.body.rate)})
    response.send(data)
})

router.route("/addExtras")
.post(async (request, response)=>{
    console.log(request.body)
    const data = await addExtras({...request.body, rate:parseFloat(request.body.rate)})
    response.send(data)
})

router.route("/getExtras")
.get(async (request, response)=>{
    const data = await getExtras()
    response.send(data)
})

router.route("/deliveryMethods")
.post(async (request, response)=>{
    console.log(request.body)
    const data = await setDeliveryMethods(request.body)
    response.send(data)
})

router.route("/getDeliveryMethods")
.get(async (request, response)=>{
    const data = await getDeliveryMethods()
    response.send(data)
})

export const ngosRouter = router