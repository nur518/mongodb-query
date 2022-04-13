  // search on two fields. first name or last name
  // case insensitive and any match
  const docs = await UserInfo.find(
    {
      "$or": [{ firstName: { $regex: new RegExp(req.query.name, 'i') } }, { lastName: { $regex: new RegExp(req.query.name, 'i') } }]
    }
  )
