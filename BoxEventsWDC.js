(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
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

    var tableSchema = {
        id: "BoxEvents",
        alias: "All Box Events in the environment",
        columns: cols
        };

    schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {

       var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.box.com/2.0/events",
      "method": "GET",
      "headers": {
        "Authorization": "Bearer OFq5QVbOPWqLHhUzG8qheXtazsW2EIg8",
        "cache-control": "no-cache",
        "Postman-Token": "a44dec9b-2eae-4ea2-ac57-da03fee67366"
      }
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
    

    var ent = response.entries,
                tableData = [];

            // Iterate over the JSON object
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

            table.appendRows(tableData);
            doneCallback();
    });
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "Box Events";
        tableau.submit();
        });
    });
})();
