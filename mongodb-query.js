  // search on two fields. first name or last name
  // case insensitive and any match
  const docs = await UserInfo.find(
    {
      "$or": [{ firstName: { $regex: new RegExp(req.query.name, 'i') } }, { lastName: { $regex: new RegExp(req.query.name, 'i') } }]
    }
  )

  // pull object from array by (object property condition)
  await DriveShare.findOneAndUpdate({ folderIds: { $all: folderIds }, "sharedUsers.email": email }, { $pull: { sharedUsers: { email: email } } }, { new: true });

  //push multiple item in array
  await folderShared.updateOne({ $push: { sharedUsers: { $each: sharedUsers } } }, { new: true });

// insert([{}, {}]) multiple update  // bydefault "ordered" is true
// ordered:true // if error occure operation will break. because inserting serially
// ordered:false // if error other will insert after finish throw error

db.users.insert([{_id: 1, name: 'a'}, {_id: 1, name: 'b'}, {_id: 2, name: 'c'}], {"ordered": false})
// 'a' and 'c' will insert

db.users.insert([{_id: 1, name: 'a'}, {_id: 1, name: 'b'}, {_id: 2, name: 'c'}])
// only 'a' will insert
