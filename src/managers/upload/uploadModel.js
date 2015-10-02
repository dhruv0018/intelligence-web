
class UploadModel {

    constructor(uploaderServiceInstance) {

        this.uploaderServiceInstance = uploaderServiceInstance;
        this.files = [];
    }

    /*
     * Starts uploading 'files'
     */
    upload() {
        this.uploaderServiceInstance.upload();
        // For evaporate it instead would be...
        /*
        this.files.forEach(fileObject => {
            let {file, fileName} = fileObject;
            this.evaporate.add(file, fileName, this.fileComplete);)
        })
        */
    }

    addFile(file, fileName) {
        this.files.push({
            file,
            fileName
        });
    }

    cancel() {
        this.uploaderServiceInstance.cancel();
    }

    progress() {
        return this.uploaderServiceInstance.progress();
    }
}

export default UploadModel;
