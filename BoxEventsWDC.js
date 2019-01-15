(function () {

    //declare variables
    var myConnector = tableau.makeConnector();
    
    function submitButtonOnClick()  {

            tableau.connectionName = "Box Events";  

            //store the form data because the submit causes it to disappear
            var devToken = $('#developertoken').val();
            tableau.connectionData = JSON.stringify(devToken);
            tableau.submit();
    };

    //capture developer token from HTML input
    //
    //document.getElementById("developertoken").value
    

    //set up schema to map in data
    myConnector.getSchema = function (schemaCallback) {
    //declare column formatting, alias, and datatypes
    var cols = [{
        id: "event_id",
        alias: "Event Id",
        dataType: tableau.dataTypeEnum.string
        }, {
        id: "name",
        alias: "User Name",
        dataType: tableau.dataTypeEnum.string
        }, {
        id: "login",
        alias: "User Email",
        dataType: tableau.dataTypeEnum.string
        }, {
        id: "created_at",
        alias: "Event Created",
        dataType: tableau.dataTypeEnum.datetime
        }, {
        id: "type",
        alias: "Event Type",
        dataType: tableau.dataTypeEnum.string
        }, {
        id: "docname",
        alias: "Document Name",
        dataType: tableau.dataTypeEnum.string
        }];

    //put columns in to table variable
    var tableSchema = {
        id: "BoxEvents",
        alias: "Box Events",
        columns: cols
        };

    //send it
    schemaCallback([tableSchema]);
    };

    //pull data from the API and map it to the schema
    myConnector.getData = function(table, doneCallback) {
        var devToken = JSON.parse(tableau.connectionData);
        console.log("printing devtoken" + devToken);
        console.log(tableau.connectionData);

    //define the GET request to Box Events API
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.box.com/2.0/events",
      "method": "GET",
      "headers": {
        "Authorization": "Bearer yfNt0TFzYQV4zFf8GWHmHvNBIrI8jamX",
        "cache-control": "no-cache",
        "Postman-Token": "a44dec9b-2eae-4ea2-ac57-da03fee67366"
      }
    }

    //call the API
    $.ajax(settings).done(function (response) {
      console.log(response);
    
    //map the response events in to the columns of the table object
    var ent = response.entries,
                tableData = [];

            // Iterate over the JSON object response
            for (var i = 0, len = ent.length; i < len; i++) {
                tableData.push({
                    "event_id": ent[i].event_id,
                    "name": ent[i].created_by.name,
                    "login": ent[i].created_by.login,
                    "created_at": ent[i].created_at,
                    "type": ent[i].event_type,
                    "docname": ent[i].source.name
                });
            };
            //add rows of data to the table
            table.appendRows(tableData);
            doneCallback();
        });
    };

    //tableau magic command
    tableau.registerConnector(myConnector);

    function wdcInit()  {
        $("#submitButton").click(submitButtonOnClick);
    };
    
    //onload 
    $(document).ready(wdcInit);

})();

