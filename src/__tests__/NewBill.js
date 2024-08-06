/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import {ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";

import mockStore from "../__mocks__/store.js"
import router from "../app/Router.js";

jest.mock("../app/Store.js", () => mockStore)


beforeEach( ()=> {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', `{"type":"Employee","email":"employee@test.ltd"}`)
  const root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.append(root)
  router()
  window.onNavigate(ROUTES_PATH.NewBill)
  const inputExpanseName = screen.getByTestId("expense-name")
  fireEvent.change(inputExpanseName,{target:{value:"Vol Nantes Paris"}})
  
  const inputDate = screen.getByTestId("datepicker")
  fireEvent.change( inputDate, {target:{value:"2024-06-21"}})
  
  const inputAmount = screen.getByTestId("amount")
  fireEvent.change(inputAmount,{target:{value:"1024"}})
  
  const inputPct = screen.getByTestId("pct")
  fireEvent.change(inputPct,{target:{value:"20"}})
})

afterEach(() => {
  document.body.innerHTML = ''
})
  
describe("Given I am connected as an employee on new bill page", ()=> {
  describe("When I select a attached file image", ()=> {
    test("Then creating new bill from mock API POST fails with 500 message error in console", async ()=> {
      const error = new Error("Error 500")
      mockStore.setShouldRejectCreate(true)
      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['Facture'], 'facture.png', {type: 'image/png'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(()=>{})
      await new Promise(process.nextTick)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
      consoleErrorSpy.mockRestore()
      mockStore.setShouldRejectCreate(false)
    })
  })

  describe("When I filled in the form correctly", ()=> {
    test("Then update new bill from mock API POST fails with 500 message error in console", async ()=> {
      const error = new Error("Error 500")
      mockStore.setShouldRejectUpdate(true)
      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['Facture'], 'facture.png', {type: 'image/png'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })
      userEvent.click(document.getElementById("btn-send-bill"))
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(()=>{})
      
      await new Promise(process.nextTick)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
      consoleErrorSpy.mockRestore()
      mockStore.setShouldRejectUpdate(false)
    })
  })

  describe("When I am on NewBill Page", ()=> {
    test("Then bill icon in vertical layout should be highlighted", async ()=> {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', `{"type":"Employee","email":"employee@test.ltd"}`)
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains("active-icon")).toBe(true)
    })
  })

  describe("When I select a non-image file for a receipt ", ()=> {
    test("Then attached file should not select",async ()=>{
      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['Facture'], 'facture.txt', {type: 'text/plain'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })
      const test = screen.getByTestId("file")
      await new Promise(process.nextTick)
      expect(document.querySelector(".msgErreur").innerHTML).toBe("format incorrect")
    })
  })
  
  describe("When I send new bill by clicking on send ", ()=> {

    test("Then NewBill should be call POST API with create method, call PATCH API with update method, and go back to Bills page", async ()=> {
      //Constante des valeurs attendu
      const valeur =         {
        data: '{"type":"Transports","name":"Vol Nantes Paris","amount":1024,"date":"2024-06-21","vat":"","pct":20,"commentary":"","fileUrl":"https://localhost:3456/images/test.jpg","fileName":"","status":"pending"}',
        selector: '1234'
      }

      //Définition de l'image d'un fichier image de justificatif
      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['facture'], 'facture.png', {type: 'image/png'})
      
      //Injection de l'image du justificatif dans l'input file
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })
      //await spyCreate().create()
      await new Promise(process.nextTick)

      //Vérification que l'image de justificatif est bien pris en compte et que la fonction Create à été appelé
      expect(inputFile.files[0].type).toBe("image/png")

      //Espion du console.log de retour de l'espion de la fonction Update
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementationOnce(()=>{})

      //simulation du click sur l'icone envoyer
      userEvent.click(document.getElementById("btn-send-bill"))
      //await spyUpdate().update()

      //Vérification de la concordance entre les valeurs attendu et les valeur de retour de create dans la console
      expect(consoleLogSpy).toHaveBeenCalledWith(valeur)
      const windowIcon = screen.getByTestId('icon-window')

      //vérification du retour sur la page Bills
      expect(windowIcon.classList.contains('active-icon')).toBe(true)

    })
  })

})