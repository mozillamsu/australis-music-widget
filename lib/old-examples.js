function AudioFile(parentDir, file) {
   let title = '';
   let artist = '';
   let fileName = file;
   let parentPath = parentDir.getPath();

   return {
       getPath: function() {
           return io.join(parentPath, fileName);
       },

       toString: function() {
           return fileName;
       },

       getData: function() {
           console.log('===AudioFile::getData()===');
           let path = io.join(parentPath, fileName);
           let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
           file.initWithPath(path);

           let contentType = Cc['@mozilla.org/mime;1'].getService(Ci.nsIMIMEService).getTypeFromFile(file);

           console.log('content type: ' + contentType);

           console.log('getting file input stream');
           let fileInputStream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream);
           fileInputStream.init(file, 0x01, 0600, 0);

           console.log('getting binary input stream');
           let binaryInputStream = Cc['@mozilla.org/binaryinputstream;1'].createInstance(Ci.nsIBinaryInputStream);
           binaryInputStream.setInputStream(fileInputStream);

           console.log('getting encoded bytes');
           let encodedBytes = binaryInputStream.readBytes(binaryInputStream.available());

           return {
               displayName: fileName,
               contentType: contentType,
               data: encodedBytes
           };
       },

       toDataURI: function() {
           console.log('===toDataURI()===');
           let path = io.join(parentPath, fileName);
           let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
           file.initWithPath(path);

           let contentType = Cc['@mozilla.org/mime;1'].getService(Ci.nsIMIMEService).getTypeFromFile(file);

           console.log('content type: ' + contentType);

           console.log('getting file input stream');
           let fileInputStream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream);
           fileInputStream.init(file, 0x01, 0600, 0);

           console.log('getting binary input stream');
           let binaryInputStream = Cc['@mozilla.org/binaryinputstream;1'].createInstance(Ci.nsIBinaryInputStream);
           binaryInputStream.setInputStream(fileInputStream);

           console.log('getting encoded bytes');
           let encodedBytes = binaryInputStream.readBytes(binaryInputStream.available());

           console.log('typeof(encodedBytes) == ' + typeof(encodedBytes));
           console.log(encodedBytes);

           console.log('trying btoa');
           console.log(btoa('hello world'));

           console.log('getting encoded data');
           let encodedData = btoa(encodedBytes);

           console.log('end of toDataURI()');
           return 'data:' + contentType + ';base64,' + encodedData;
       }
   };
}