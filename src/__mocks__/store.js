let shouldRejectCreate500 = false
let shouldRejectCreate404 = false
let shouldRejectUpdate500 = false
let shouldRejectUpdate404 = false
let shouldRejectList500 = false
let shouldRejectList404 = false
let newBill=null

const mockedBills = {
  list() {
    if (shouldRejectList500) {
      return Promise.reject(new Error("Erreur 500"))
    } 
    if (shouldRejectList404) {
      return Promise.reject(new Error("Erreur 404"))
    } 
    if(newBill){
      return Promise.resolve([
        {
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": newBill.vat,
        "fileUrl": newBill.fileUrl,
        "status": newBill.status,
        "type": newBill.type,
        "commentary": newBill.commentary,
        "name": newBill.name,
        "fileName": "facture.jpg",
        "date": newBill.date,
        "amount": newBill.amount,
        "commentAdmin": "ok",
        "email": "a@a",
        "pct": newBill.pct
        },
        {
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "pending",
        "type": "Hôtel et logement",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": 400,
        "commentAdmin": "ok",
        "email": "a@a",
        "pct": 20
        },
        {
          "id": "BeKy5Mo4jkmdfPGYpTxZ",
          "vat": "",
          "amount": 100,
          "name": "test1",
          "fileName": "1592770761.jpeg",
          "commentary": "plop",
          "pct": 20,
          "type": "Transports",
          "email": "a@a",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…61.jpeg?alt=media&token=7685cd61-c112-42bc-9929-8a799bb82d8b",
          "date": "2001-01-01",
          "status": "refused",
          "commentAdmin": "en fait non"
        },
        {
          "id": "UIUZtnPQvnbFnB0ozvJh",
          "name": "test3",
          "email": "a@a",
          "type": "Services en ligne",
          "vat": "60",
          "pct": 20,
          "commentAdmin": "bon bah d'accord",
          "amount": 300,
          "status": "accepted",
          "date": "2003-03-03",
          "commentary": "",
          "fileName": "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3"
        },
        {
          "id": "qcCK3SzECmaZAGRrHjaC",
          "status": "refused",
          "pct": 20,
          "amount": 200,
          "email": "a@a",
          "name": "test2",
          "vat": "40",
          "fileName": "preview-facture-free-201801-pdf-1.jpg",
          "date": "2002-02-02",
          "commentAdmin": "pas la bonne facture",
          "commentary": "test2",
          "type": "Restaurants et bars",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
        }
      ])
    }else {
      return Promise.resolve([{
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "pending",
        "type": "Hôtel et logement",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": 400,
        "commentAdmin": "ok",
        "email": "a@a",
        "pct": 20
        },
        {
          "id": "BeKy5Mo4jkmdfPGYpTxZ",
          "vat": "",
          "amount": 100,
          "name": "test1",
          "fileName": "1592770761.jpeg",
          "commentary": "plop",
          "pct": 20,
          "type": "Transports",
          "email": "a@a",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…61.jpeg?alt=media&token=7685cd61-c112-42bc-9929-8a799bb82d8b",
          "date": "2001-01-01",
          "status": "refused",
          "commentAdmin": "en fait non"
        },
        {
          "id": "UIUZtnPQvnbFnB0ozvJh",
          "name": "test3",
          "email": "a@a",
          "type": "Services en ligne",
          "vat": "60",
          "pct": 20,
          "commentAdmin": "bon bah d'accord",
          "amount": 300,
          "status": "accepted",
          "date": "2003-03-03",
          "commentary": "",
          "fileName": "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3"
        },
        {
          "id": "qcCK3SzECmaZAGRrHjaC",
          "status": "refused",
          "pct": 20,
          "amount": 200,
          "email": "a@a",
          "name": "test2",
          "vat": "40",
          "fileName": "preview-facture-free-201801-pdf-1.jpg",
          "date": "2002-02-02",
          "commentAdmin": "pas la bonne facture",
          "commentary": "test2",
          "type": "Restaurants et bars",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
        }
      ])
    }
  },
  create(bill) {
    if (shouldRejectCreate500) {
      return Promise.reject(new Error("Error 500"))
    } 
    if (shouldRejectCreate404) {
      return Promise.reject(new Error("Error 404"))
    } else {
      return Promise.resolve({fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234'})
    }
  },
  // create(bill) {

  //   return Promise.resolve({fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234'})
  // },
  update(bill) {
    if (shouldRejectUpdate500) {
      return Promise.reject(new Error("Error 500"))
    }
    if (shouldRejectUpdate404) {
      return Promise.reject(new Error("Error 404"))
    }else{
      return Promise.resolve(console.log(bill))
      // return Promise.resolve({
      //   "id": "47qAXb6fIm2zOKkLzMro",
      //   "vat": "80",
      //   "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
      //   "status": "pending",
      //   "type": "Hôtel et logement",
      //   "commentary": "Vol Nantes Paris",
      //   "name": "Vol Nantes Paris",
      //   "fileName": "preview-facture-free-201801-pdf-1.jpg",
      //   "date": "2004-04-04",
      //   "amount": 500,
      //   "commentAdmin": "ok",
      //   "email": "a@a",
      //   "pct": 20
      // })
    }
  },
}

// export default {
//   bills() {
//     return mockedBills
//     //return {}
//   },
// }
export default {
  bills() {
    return mockedBills;
  },
  setShouldRejectCreateWith404(value) {
    shouldRejectCreate404 = value;
  },
  setShouldRejectCreateWith500(value) {
    shouldRejectCreate500 = value;
  },
  setShouldRejectUpdateWith404(value) {
    shouldRejectUpdate404 = value;
  },
  setShouldRejectUpdateWth500(value) {
    shouldRejectUpdate500 = value;
  },
  setShouldRejectListWith404(value) {
    shouldRejectList404 = value;
  },
  setShouldRejectListWith500(value) {
    shouldRejectList500 = value;
  },
  setNewBill(value) {
    newBill = value
  }
};
