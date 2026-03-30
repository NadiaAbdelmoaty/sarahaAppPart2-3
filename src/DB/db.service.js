export const create= async({model,data}={})=>{
   return await model.create(data)

}

export const findOne= async({model,filter={},options={}, select = ""} ={})=>{
   const doc=  model.findOne(filter)
   if(options.populate){
    doc.populate(options.populate)
   }
     if(options.skip){
    doc.skip(options.skip)
   }
     if(options.limit){
    doc.limit(options.limit)
   }
       if(select){
    doc.select(select)
   }
return await doc.exec()
}
export const findById= async({model,filter={},options={}, select = ""} ={})=>{
   const doc=  model.findById(filter)
   if(options.populate){
    doc.populate(options.populate)
   }
     if(options.skip){
    doc.skip(options.skip)
   }
     if(options.limit){
    doc.limit(options.limit)
   }
       if(select){
    doc.select(select)
   }
return await doc.exec()
}
export const findOneAndUpdate= async({model,filter={},update={},options={}, select = ""} ={})=>{
   const doc=  model.findOneAndUpdate(filter,update,options)
   if(options.populate){
    doc.populate(options.populate)
   }
     if(options.skip){
    doc.skip(options.skip)
   }
     if(options.limit){
    doc.limit(options.limit)
   }
       if(select){
    doc.select(select)
   }
return await doc.exec()
}
export const find= async({model,filter={},options={}}={})=>{
   const doc=  model.find(filter)
   if(options.populate){
    doc.populate(options.populate)
   }
     if(options.skip){
    doc.skip(options.skip)
   }
     if(options.limit){
    doc.limit(options.limit)
   }
return await doc.exec()
}

export const updateOne= async({model,filter={},update={},options={}}={})=>{
   const doc=  model.updateOne(filter,update,{runValidators:true,...options})
   
return await doc.exec()
}
export const updateOneAndUpdate= async({model,filter={},update={},options={}}={})=>{
   const doc=  model.updateOneAndUpdate(filter,update,{new:true,runValidators:true,...options})
   
return await doc.exec()
}
export const deleteMany=({model,id}={})=>{
     const doc = model.deleteMany(id)
    

return doc
}