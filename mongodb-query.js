//Find
//------------------------------------------------------
//1) search on two fields. first name or last name
  // case insensitive and any match
  const docs = await UserInfo.find(
    {
      "$or": [{ firstName: { $regex: new RegExp(req.query.name, 'i') } }, { lastName: { $regex: new RegExp(req.query.name, 'i') } }]
    }
  )

 
//2) filter by array item
  const users = await UserInfo.find({ "roles.roleId": roleId}).select("firstName lastName email")
  
  //if multiple match need //it will not work we need element match "$elemMatch"
  const users = await UserInfo.find({ "roles.roleId": roleId, "roles.assignState": true }).select("firstName lastName email")
  
//3) filter by array item and also same match element
  const users = await UserInfo.find({ roles: { $elemMatch: { roleId, assignState: true } } }).select("firstName lastName email")

//Update
//-----------------------------------------------------
  // pull object from array by (object property condition)
  await DriveShare.findOneAndUpdate({ folderIds: { $all: folderIds }, "sharedUsers.email": email }, { $pull: { sharedUsers: { email: email } } }, { new: true });

  // push multiple item in array
  await folderShared.updateOne({ $push: { sharedUsers: { $each: sharedUsers } } }, { new: true });

// insert
//---------------------------------------------------------
// insert([{}, {}]) multiple update  // bydefault "ordered" is true
// ordered:true // if error occure operation will break. because inserting serially
// ordered:false // if error other will insert after finish throw error

db.users.insert([{_id: 1, name: 'a'}, {_id: 1, name: 'b'}, {_id: 2, name: 'c'}], {"ordered": false})
// 'a' and 'c' will insert

db.users.insert([{_id: 1, name: 'a'}, {_id: 1, name: 'b'}, {_id: 2, name: 'c'}])
// only 'a' will insert
