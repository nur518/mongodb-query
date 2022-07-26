// create actual folder path from DB
// create folder according this path
// place file in right folder
exports.downloadDriveFolder = catchAsync(async (req, res, next) => {
  const parentId = req.params.id;
  let staticPath = "downloadProcess"
  let fileAndFolderPath = []

  //1) all nested folders of this parent folder
  const childAllFolders = await DriveFolder.find({ "folderPath.id": parentId })

  //2) parent folder might have file
  const parentFolder = await DriveFolder.findById(parentId)
  childAllFolders.unshift(parentFolder)

  //3) Create path of all child, if only folder have file
  for (let childFolder of childAllFolders) {

    const files = await DriveFile.find({ folderId: childFolder.id })
    const folderPathArr = childFolder.folderPath

    //no files in this folder
    if (!files.length) {
      continue;
    }

    for (let file of files) {
      let filePath = ''

      for (let k = 0; k < folderPathArr.length; k++) {
        //find parentFolder index
        let parentIndex = 0;
        if (folderPathArr[k].id === parentId) {
          parentIndex = k;
        }

        //add to path from parent folder name // skip grand parent folders, if have
        if (k >= parentIndex) {
          filePath += `/${folderPathArr[k].folderName}`
        }
      }

      // filePath += `/${childFolder.folderName}/${path.basename(file.url)}` 
      filePath += `/${childFolder.folderName}`; //without filename
      fileAndFolderPath.push({ path: filePath, fileUrl: file.url })
      filePath = ''
    }

  }

  //4) Create Folder and Write File In Folder
  for (let fileAndFolder of fileAndFolderPath) {
    staticPath += fileAndFolder.path

    //create directories according the path.
    fs.mkdirSync(path.join(__dirname, staticPath), { recursive: true }, (err) => {
      if (err) {
        console.log("Something went wrong creating a folder");
        console.log(err);
      }
    })


    //write file in this path last folder
    const fileUrl = fileAndFolder.fileUrl
    const fileName = path.basename(fileUrl)

    const reqForFile = https.get(fileUrl, (res) => {
      let directory = "downloadProcess" + fileAndFolder.path
      const fileStream = fs.createWriteStream(path.join(__dirname, ...directory.split('/'), fileName))
      res.pipe(fileStream)

      fileStream.on("error", (err) => {
        console.log("Error writing to the stream.");
        console.log(err);
      })

      fileStream.on("finish", () => {
        fileStream.close()
        console.log("Done!")
      })
    })

    reqForFile.on("error", (err) => {
      console.log("Error downloading the file.");
      console.log(err);
    })

    staticPath = "downloadProcess"
  }

  res.send("dd")
})
