


const content = `
function doPost(e) {
    var cache = CacheService.getScriptCache();
    
    // Parse the POST body as JSON
    const entry = {
      results: e.postData.contents,
      timestamp: new Date().getTime()
    };
    
    cache.put("recent", JSON.stringify(entry));
    return ContentService.createTextOutput("Cache updated successfully");
  }
  
  function doGet(e) {
    var cache = CacheService.getScriptCache();
    var response;
  
    if (Object.keys(e.parameter).length === 0) {
      var recent = cache.get("recent");
      if (recent !== null) {
        const entry = JSON.parse(recent);
        const time = new Date(entry.timestamp).toLocaleString();
        const output = \`Last updated: \${time}\\n\${entry.results}\`;
        return ContentService.createTextOutput(output);
      } else {
        return ContentService.createTextOutput("No Recent Connection");
      }
    } else if (e.parameter.verify === "true") {
      response = {"result":"success"};
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
  }
`

export default content;