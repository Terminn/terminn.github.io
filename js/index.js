if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('../sw.js')
            .then(reg => console.log('Service worker: registered'))
            .catch(err => console.log('Service worker: error = ' + err));
    });
}

function testOnline() {
    if(!navigator.onLine) {
        let status = document.getElementById("online");
        status.textContent = "Offline";
        status.id = "offline";
    }
}

var dbName ='JsStore_Demo';
function getDbSchema() {
  var tblClient = {
    name: 'Client',
    columns: {
        // Here "Id" is name of column 
        id:{ primaryKey: true, autoIncrement: true },
        mail:  { notNull: true, dataType: "string", unique: true },
        nom:  { notNull: true, dataType: "string" },
        prenom : { notNull: true, dataType: "string" }
    }
  };
  var db = {
      name: dbName,
      tables: [tblClient]
  }
  return db;
}

// executing jsstore inside a web worker
var connection = new JsStore.Connection(new Worker('/js/jsstore.worker.js'));

async function initJsStore() {
      var database = getDbSchema();
      const isDbCreated = await connection.initDb(database);
      if(isDbCreated===true){
          console.log("db created");
          // here you can prefill database with some data
      }
      else {
        console.log("db opened");
      }
}

async function submit() {
    var form = document.getElementById("formulaire");
    var personne = [];
    var value = {
        mail: form.elements[0].value,
        nom: form.elements[1].value,
        prenom: form.elements[2].value
    }

    try {
        var noOfDataInserted = await connection.insert({
            into: 'Client',
            values: [value]
        });
    } catch(err) {
        alert("ERREUR");
    }
    if (noOfDataInserted > 0) {
        console.log('successfully added');
        readClients();
    }
}

async function readClients() {
    var results = await connection.select({
        from: 'Client'
    });
    console.log(results.length + ' record found');
    let div = document.getElementById("tab");
    div.textContent = "";
    let table = document.createElement('table');
    let tr = document.createElement('tr');
    tr.innerHTML += '<td>ID</td>';
    tr.innerHTML += '<td>Mail</td>';
    tr.innerHTML += '<td>Nom</td>';
    tr.innerHTML += '<td>Prénom</td>';
    table.appendChild(tr);
    for(let i = 0; i < results.length; i++) {
        let tr = document.createElement('tr');
        tr.innerHTML += '<td>'+results[i].id+'</td>';
        tr.innerHTML += '<td>'+results[i].mail+'</td>';
        tr.innerHTML += '<td>'+results[i].nom+'</td>';
        tr.innerHTML += '<td>'+results[i].prenom+'</td>';
        table.appendChild(tr);
    }
    div.appendChild(table);
}

async function search() {
    let element = document.getElementById("element").value;
    let column = document.getElementById("column").value;
    switch(column) {
        case 'mail':
            var results = await connection.select({
                from: 'Client',
                where: {
                    mail: element
                }
            });
            console.log(results.length);
            break;
        case 'nom':
            var results = await connection.select({
                from: 'Client',
                where: {
                    nom: element
                }
            });
            console.log(results.length);
            break;
        case 'prenom':
            var results = await connection.select({
                from: 'Client',
                where: {
                    prenom: element
                }
            });
            console.log(results.length);
            break;
        default:
            console.log("No result");
            break;
    }
    let div = document.getElementById("tab");
    div.textContent = "";
    let table = document.createElement('table');
    let tr = document.createElement('tr');
    tr.innerHTML += '<td>ID</td>';
    tr.innerHTML += '<td>Mail</td>';
    tr.innerHTML += '<td>Nom</td>';
    tr.innerHTML += '<td>Prénom</td>';
    table.appendChild(tr);
    for(let i = 0; i < results.length; i++) {
        let tr = document.createElement('tr');
        tr.innerHTML += '<td>'+results[i].id+'</td>';
        tr.innerHTML += '<td>'+results[i].mail+'</td>';
        tr.innerHTML += '<td>'+results[i].nom+'</td>';
        tr.innerHTML += '<td>'+results[i].prenom+'</td>';
        table.appendChild(tr);
    }
    div.appendChild(table);

}

async function remove() {
    let element = document.getElementById("element").value;
    let column = document.getElementById("column").value;
    switch(column) {
        case 'mail':
            var results = await connection.remove({
                from: 'Client',
                where: {
                    mail: element
                }
            });
            console.log(results.length);
            break;
        case 'nom':
            var results = await connection.remove({
                from: 'Client',
                where: {
                    nom: element
                }
            });
            console.log(results.length);
            break;
        case 'prenom':
            var results = await connection.remove({
                from: 'Client',
                where: {
                    prenom: element
                }
            });
            console.log(results.length);
            break;
        default:
            console.log("No result");
            break;
    }
    readClients();
}

async function drop() {
    connection.dropDb().then(function() {
        console.log('Db deleted successfully');
    }).catch(function(error) {
        console.log(error);
    });;
    initJsStore();
    readClients();
}