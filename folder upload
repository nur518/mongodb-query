exports.uploadDriveFolder = catchAsync(async (req, res, next) => {
  const files = req.files
  const filesLength = files.length;
  const userId = req.body.userId;
  const { parentId = 0, folderPath = [] } = req.body;
  let folderNestedPaths = req.body.folderNestedPaths;

  //for one file formData not create array
  if (filesLength === 1) {
    folderNestedPaths = [folderNestedPaths]
  }

  for (let i = 0; i < filesLength; i++) {
    let folderNames = folderNestedPaths[i].split('/').slice(0, -1); //omit last //last item is a file name
    let lastFolderName = folderNames.slice(-1)[0] //last folder name
    let folderNamesLength = folderNames.length

    let parentFolderId = parentId;
    let parentFolderName = '';
    let parentFolderFolderPath = folderPath;

    for (let j = 0; j < folderNamesLength; j++) {
      if (j !== 0) {
        //create folder path
        parentFolderFolderPath = [...parentFolderFolderPath, { folderName: parentFolderName, id: parentFolderId }]
      }

      //folder exists //folder name unique
      const existFolder = await DriveFolder.findOne({ userId, parentId: parentFolderId, folderName: folderNames[j] })
      if (existFolder) {
        //store for next folder
        parentFolderId = existFolder.id
        parentFolderName = existFolder.folderName
        parentFolderFolderPath = existFolder.folderPath

        continue;
      }


      // create folder
      const newFolderObj = {
        expanded: false,
        folderName: folderNames[j],
        userId,
        parentId: parentFolderId,
        folderPath: parentFolderFolderPath
      }
      const newFolder = await DriveFolder.create(newFolderObj)

      //store for next folder
      parentFolderId = newFolder.id
      parentFolderName = newFolder.folderName
      parentFolderFolderPath = newFolder.folderPath

      //last folder //upload file using this folder id
      if (folderNames[j] === lastFolderName) {
        //upload file to aws s3 bucket
        const uploadedFile = await s3SingleFileUpload(files[i], '/drive')

        const newFileObj = {
          url: uploadedFile.Location,
          fileName: uploadedFile.Key,
          folderId: newFolder.id,
          userId,
          fileType: path.extname(uploadedFile.Key)
        }
        await DriveFile.create(newFileObj)
      }
    }

  }

  res.status(200).json({
    status: 'success',
    message: "Folder uploaded success"
  })
})
