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
